// Authors routes: CRUD for authors used by posts.
// Simple endpoints that read/write the `authors` table.
import express from "express";
import pool from "../database/db.js";

const router = express.Router();

// GET all authors
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM authors ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single author by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM authors WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create an author
router.post("/", async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const result = await pool.query(
      `INSERT INTO authors (name, email, avatar)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, avatar]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an author
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, avatar } = req.body;

    const result = await pool.query(
      `UPDATE authors 
       SET name = $1, email = $2, avatar = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, avatar, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an author
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM authors WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;