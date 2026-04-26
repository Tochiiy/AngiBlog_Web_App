// Comments routes: fetch, add, and delete comments for posts.
// Adding/deleting comments requires authentication (protect middleware).
import express from "express";
import pool from "../database/db.js";
import protect from "../middleware/auth_v.js";

const router = express.Router();


router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query(
      `SELECT comments.*, users.username, users.avatar
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at DESC`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:postId", protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.admin.id; 

    if (!content) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [postId, userId, content]
    );

  
    const comment = await pool.query(
      `SELECT comments.*, users.username, users.avatar
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(comment.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:commentId", protect, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.admin.id;

    const result = await pool.query(
      `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
      [commentId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;