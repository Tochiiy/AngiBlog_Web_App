// Likes routes: get counts, user's reaction, and toggle/add reactions.
// Uses `protect` for actions tied to the current user.
import express from "express";
import pool from "../database/db.js";
import protect from "../middleware/auth_v.js";

const router = express.Router();


router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query(
      `SELECT
        COUNT(CASE WHEN type = 'like' THEN 1 END) AS likes,
        COUNT(CASE WHEN type = 'dislike' THEN 1 END) AS dislikes
       FROM likes WHERE post_id = $1`,
      [postId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:postId/me", protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.admin.id;

    const result = await pool.query(
      `SELECT type FROM likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    res.json({ reaction: result.rows[0]?.type || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:postId", protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body; 
    const userId = req.admin.id;

  
    const existing = await pool.query(
      `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].type === type) {
        
        await pool.query(
          `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
          [postId, userId]
        );
        return res.json({ message: "Reaction removed" });
      } else {
       
        await pool.query(
          `UPDATE likes SET type = $1 WHERE post_id = $2 AND user_id = $3`,
          [type, postId, userId]
        );
        return res.json({ message: "Reaction updated" });
      }
    }

    
    await pool.query(
      `INSERT INTO likes (post_id, user_id, type) VALUES ($1, $2, $3)`,
      [postId, userId, type]
    );

    res.status(201).json({ message: "Reaction added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;