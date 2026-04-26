# Blog_Website

Simple full-stack blog application (React + Vite frontend, Express + Postgres backend).

## Overview
- Frontend: Frontend/ — React + Vite app
- Backend: Backend/ — Express API using PostgreSQL

## Prerequisites
- Node.js v18+ and npm
- PostgreSQL (for local development) or a hosted Postgres (Railway, Render)

## Quick start (development)
1. Backend
   ```bash
   cd Backend
   npm install
   npm run dev    # requires nodemon (dev)
   # or: npm start
   ```

2. Frontend
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

Open the the blog at render 

## Environment variables
Create a `.env` file in `Backend/` with the following keys (example names used by the code):
- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — secret for signing JWTs
- `ADMIN_SECRET_KEY` — secret required when registering admin users
- `EMAIL_USER` and `EMAIL_PASS` — SMTP creds used to send emails (Gmail in code)
- `PORT` — optional server port

## Database
The backend uses Postgres via the `pg` package. Create the database and run any SQL in `Backend/database/schema.js` if present.

## Git & Hosting (short)
- Initialize git and push to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  # create a GitHub repo, then:
  git remote add origin https://github.com/<your-username>/<repo>.git
  git branch -M main
  git push -u origin main
  ```
- Frontend deployment options: Vercel, Netlify, or GitHub Pages (build output in `dist/`). Vercel is easiest for Vite + React.
- Backend deployment options: Railway, Render, or Fly.io (configure `DATABASE_URL` and other env vars on the platform).

## Notes
- I did not change any source files. See `CODE_COMMENTS.md` for suggested entry-level comments to add to source files if you want inline explanations.
