
// Subscribers routes: simple endpoint to add email subscribers.
// Uses ON CONFLICT to avoid duplicate subscriptions.
import express from "express";
import pool from "../database/db.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await pool.query(
      `INSERT INTO subscribers (email)
       VALUES ($1)
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Already subscribed" });
    }

    res.status(201).json({ message: "Subscribed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;