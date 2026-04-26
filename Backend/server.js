// Entry: sets up Express server, middleware, and mounts API routers.
// Keep the code below unchanged; these comments are for entry-level developers.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postsRouter from "./routes/posts.js";
import authorsRouter from "./routes/authors.js";
import subscribersRouter from "./routes/subscribers.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js"; // ← add
import commentsRouter from "./routes/comments.js"; // ← add
import likesRouter from "./routes/likes.js";

dotenv.config();

const app = express();

// Allow the frontend origin from env in production; fall back to localhost for dev.
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

// routes
// Mount API route handlers under /api/*
app.use("/api/posts", postsRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/subscribers", subscribersRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter); // ← add
app.use("/api/comments", commentsRouter); // ← add
app.use("/api/likes", likesRouter); // ← add

app.get("/", (req, res) => {
  res.json({ message: "Blog API is running!" });
});

// Start the server on the configured PORT (default 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
