// Posts routes: list, view, create, update, delete blog posts.
// Protected routes use `protect` middleware which validates JWTs.
import express from "express";
import pool from "../database/db.js";
import protect from "../middleware/auth_v.js";
const router = express.Router();

// GET all posts
router.get("/",  async (req, res) => {
  try {
    const { tag } = req.query;
    let result;

    if (tag && tag !== "All") {
      result = await pool.query(
        `SELECT posts.*, authors.name AS author_name, authors.avatar
         FROM posts
         JOIN authors ON posts.author_id = authors.id
         WHERE posts.published = true 
         AND $1 = ANY(posts.tags)
         ORDER BY posts.created_at DESC`,
        [tag]
      );
    } else {
      result = await pool.query(
        `SELECT posts.*, authors.name AS author_name, authors.avatar
         FROM posts
         JOIN authors ON posts.author_id = authors.id
         WHERE posts.published = true
         ORDER BY posts.created_at DESC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET search posts
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const result = await pool.query(
      `SELECT posts.*, authors.name AS author_name, authors.avatar
       FROM posts
       JOIN authors ON posts.author_id = authors.id
       WHERE posts.published = true
       AND (posts.title ILIKE $1 OR posts.excerpt ILIKE $1)
       ORDER BY posts.created_at DESC`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET post by ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT posts.*, authors.name AS author_name, authors.avatar
       FROM posts
       JOIN authors ON posts.author_id = authors.id
       WHERE posts.id = $1 AND posts.published = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT posts.*, authors.name AS author_name, authors.avatar
       FROM posts
       JOIN authors ON posts.author_id = authors.id
       WHERE posts.slug = $1 
       AND posts.published = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST create a post
router.post("/", protect, async (req, res) => {
  try {
    const { title, slug, content, excerpt, cover_image, author_id, tags } = req.body;

    const result = await pool.query(
      `INSERT INTO posts (title, slug, content, excerpt, cover_image, author_id, tags, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [title, slug, content, excerpt, cover_image, author_id, tags]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a post
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, cover_image, tags, published } = req.body;

    const result = await pool.query(
      `UPDATE posts 
       SET title = $1, content = $2, excerpt = $3, 
           cover_image = $4, tags = $5, published = $6
       WHERE id = $7
       RETURNING *`,
      [title, content, excerpt, cover_image, tags, published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a post
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM posts WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;