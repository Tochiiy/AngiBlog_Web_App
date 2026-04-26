// Auth routes: handles admin registration, login, password reset flows.
// Comments are intended for entry-level developers; no logic changed.
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database/db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Nodemailer transporter: uses Gmail by default. Make sure EMAIL_USER and EMAIL_PASS are set.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const router = express.Router();


router.post("/register", async (req, res) => {
  // Register a new admin user.
  // Expects { username, email, password, secretKey } in request body.
  try {
    const { username, email, password, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ error: "Invalid secret key. Access denied!" });
    }

  
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }


    const existing = await pool.query(
      `SELECT * FROM admins WHERE email = $1`,
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const result = await pool.query(
      `INSERT INTO admins (username, email, password)
       VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

  
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin registered successfully!",
      token,
      admin: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/login", async (req, res) => {
  // Admin login: validates credentials and returns a JWT on success.
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    
    const result = await pool.query(
      `SELECT * FROM admins WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const admin = result.rows[0];

    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/me", async (req, res) => {
  // Returns the admin info from a valid JWT passed in Authorization header.
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT id, username, email FROM admins WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.post("/forgot-password", async (req, res) => {
  // Generates a reset token, stores it on the admin record, and emails a reset link.
  try {
    const { email } = req.body;

    const result = await pool.query(
      `SELECT * FROM admins WHERE email = $1`, [email]
    );
   

    if (result.rows.length === 0) {
      
      return res.json({ message: "If this email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); 
    
    await pool.query(
      `UPDATE admins SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
      [resetToken, resetExpiry, email]
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
   
    await transporter.sendMail({
      from: `"AngiBlog" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your AngiBlog admin password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #0f172a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Angi<span style="color: #3b82f6;">Blog</span></h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b;">Reset your password</h2>
            <p style="color: #64748b;">Click the button below to reset your admin password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `,
    });

    res.json({ message: "If this email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  // Resets the password for an admin using the token previously emailed to them.
  try {
    const { token, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM admins 
       WHERE reset_token = $1 
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `UPDATE admins 
       SET password = $1, reset_token = NULL, reset_token_expiry = NULL 
       WHERE reset_token = $2`,
      [hashedPassword, token]
    );

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;