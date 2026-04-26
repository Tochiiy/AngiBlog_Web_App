# Requirements

Software and minimum versions used for this project:

- Node.js >= 18
- npm >= 9 (or yarn/pnpm)
- PostgreSQL >= 12

Key packages (see package.json files for exact versions):

- Backend: `express`, `pg`, `jsonwebtoken`, `bcryptjs`, `nodemailer`, `dotenv`, `cors`
- Frontend: `react`, `react-dom`, `vite`, `axios`, `tailwindcss`, `react-router-dom`

Optional developer tools:

- `nodemon` (dev) — for auto-restarting server during development
- `git` — version control and pushing to GitHub

Environment variables (Backend/.env):
- `DATABASE_URL` — e.g. `postgres://user:pass@host:5432/dbname`
- `JWT_SECRET`
- `ADMIN_SECRET_KEY`
- `EMAIL_USER` and `EMAIL_PASS` — SMTP credentials for sending emails
- `PORT` (optional)

Local setup summary:
1. Install Node.js and PostgreSQL
2. Create Postgres DB and set `DATABASE_URL`
3. Start backend: `cd Backend && npm install && npm run dev`
4. Start frontend: `cd Frontend && npm install && npm run dev`
