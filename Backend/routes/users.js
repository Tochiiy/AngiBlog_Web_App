// Public user routes: register, login, password reset for site users.
// Uses nodemailer for password reset emails (EMAIL_USER / EMAIL_PASS required).
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database/db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3) RETURNING id, username, email, avatar`,
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );

    
    if (result.rows.length === 0) {
      return res.json({ message: "If this email exists a reset link has been sent." });
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); 

    await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
      [resetToken, resetExpiry, email]
    );
   
      const resetUrl = `http://localhost:5173/user-reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"AngiBlog" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your AngiBlog password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #0f172a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              Angi<span style="color: #3b82f6;">Blog</span>
            </h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b;">Reset your password</h2>
            <p style="color: #64748b;">
              Click the button below to reset your password. 
              This link expires in 1 hour.
            </p>
            <a href="${resetUrl}"
               style="display: inline-block; background: #3b82f6; color: white; 
                      padding: 12px 24px; border-radius: 8px; text-decoration: none; 
                      font-weight: bold; margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #94a3b8; font-size: 12px;">
              If you didn't request this ignore this email.
            </p>
          </div>
        </div>
      `,
    });

     res.json({ message: "If this email exists a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users 
       WHERE reset_token = $1 
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `UPDATE users 
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