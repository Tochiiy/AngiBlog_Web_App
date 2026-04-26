# Deployment guide — Render (recommended)

This document contains step-by-step instructions to deploy the frontend and backend to Render and to run the database schema.

1) Create a Postgres instance on Render (or use an existing provider)
   - From Render dashboard: New → PostgreSQL
   - Note the `DATABASE_URL` connection string and add it to Render env vars for the backend service.

2) Create backend service
   - New → Web Service
   - Connect to this GitHub repo and select branch `main`.
   - Use the `render.yaml` file in the repo (Render will detect and use it).
   - Add the following environment variables to the service settings:
     - `DATABASE_URL` — Postgres connection string
     - `JWT_SECRET` — random long secret
     - `ADMIN_SECRET_KEY` — admin registration key
     - `EMAIL_USER` and `EMAIL_PASS` — SMTP credentials
     - `FRONTEND_URL` — URL of deployed frontend (set after frontend is deployed)

3) Create frontend static site
   - New → Static Site
   - Connect repo and branch `main` (Render will use `render.yaml` or the build commands below)
   - Build command: `cd Frontend && npm install && npm run build`
   - Publish directory: `Frontend/dist`
   - Set env var `VITE_API_URL` to your backend API URL (e.g. `https://angi-blog-backend.onrender.com/api`)

4) Run DB schema (one-off)
   - After Postgres is provisioned, run the schema to create tables.
   - Locally (using psql):

```bash
# set DATABASE_URL for the session
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
node Backend/database/schema.js
```

   - Or use Render's one-off shell in the backend service and run:

```bash
node database/schema.js
```

5) Verify
   - Frontend should be served by Render and call the backend via `VITE_API_URL`.
   - Backend root: `GET /` should return `{ message: "Blog API is running!" }`

Notes
- If you use a different host for frontend (Vercel/Netlify), set `FRONTEND_URL` accordingly in backend envs and `VITE_API_URL` in frontend envs.
- The `render.yaml` file in this repo contains example service definitions; adjust regions and names to suit your account.
