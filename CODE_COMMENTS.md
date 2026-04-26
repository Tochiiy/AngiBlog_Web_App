

Below are short, copy-pasteable comments an entry-level developer might add to key files. I did not edit your source files; paste these where you want inline explanations.

1) Backend/server.js
- Top of file: // Entry: sets up Express app, CORS, JSON parsing, and registers route handlers
- Above route registrations: // Mount the API routes under /api/* paths
- Before app.listen: // Start server on PORT from env or default 5000

2) Backend/database/db.js
- Top: // Creates a Postgres connection pool using connection string from env var DATABASE_URL

3) Backend/routes/auth.js
- At transporter: // Nodemailer transporter using Gmail; ensure EMAIL_USER and EMAIL_PASS are set in .env
- On register/login: // These endpoints create admins and return a JWT signed with JWT_SECRET
- On forgot-password: // Generates a reset token, stores it on the DB, and emails a reset link

4) Frontend/src/main.jsx (or index file)
- Top: // Entry point: mounts React app into DOM and sets up router/providers

5) Frontend/components/*.jsx
- At top of every component file: // Purpose: short 1-line description of what this component renders
- For props: // Props: { propName: type } — explain what props are expected
- For useEffect hooks: // Effect: explain when it runs and why

6) Frontend/pages/*.jsx
- At top: // Page: brief description and primary responsibilities (fetching data, forms, etc.)

Examples (copy into files):
// Purpose: Renders blog post list and handles pagination when user scrolls
// Props: `posts` (array) — list of post objects to render
// Effect: fetches post list on mount and sets `posts` state; dependency array is [] so it runs once

If you want, I can open specific files and create a PR that adds these comments inline. You asked to keep code unchanged, so I left them in this file instead.
