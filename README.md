<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=fff" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff" alt="Express"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtoken&logoColor=fff" alt="JWT"/>
  <img src="https://img.shields.io/badge/Neon-00E599?logo=neon&logoColor=000" alt="Neon"/>
  <img src="https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=fff" alt="Render"/>
</p>

# AngiBlog

A full-stack blog platform with admin CRUD, user authentication, comments, likes, tag filtering, markdown rendering, and email subscriptions.

**Live:** [angiblog-web-app-2.onrender.com](https://angiblog-web-app-2.onrender.com)

---

## Architecture

```
Frontend (React + Vite + Tailwind)
    ↕ HTTP (fetch)
Backend (Express 5 + PostgreSQL)
    ↕ SQL
Neon PostgreSQL
  ├── authors
  ├── posts
  ├── subscribers
  ├── admins
  ├── users
  ├── comments
  └── likes
```

---

## API Reference

### Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | No | List published posts (optional `?tag=`) |
| GET | `/api/posts/search?q=` | No | Search posts by title/excerpt |
| GET | `/api/posts/id/:id` | No | Get post by ID |
| GET | `/api/posts/:slug` | No | Get post by slug |
| POST | `/api/posts` | Yes | Create post |
| PUT | `/api/posts/:id` | Yes | Update post |
| DELETE | `/api/posts/:id` | Yes | Delete post |

### Auth / Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register admin (requires `secretKey`) |
| POST | `/api/auth/login` | No | Admin login → JWT |
| GET | `/api/auth/me` | No | Current admin from JWT |
| POST | `/api/auth/forgot-password` | No | Send reset email (admin) |
| POST | `/api/auth/reset-password` | No | Reset password (admin) |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | No | Register site user |
| POST | `/api/users/login` | No | User login → JWT |
| POST | `/api/users/forgot-password` | No | Send reset email (user) |
| POST | `/api/users/reset-password` | No | Reset password (user) |

### Comments / Likes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/comments/:postId` | No | Get post comments |
| POST | `/api/comments/:postId` | Yes | Add comment |
| DELETE | `/api/comments/:commentId` | Yes | Delete comment (owner) |
| GET | `/api/likes/:postId` | No | Get like/dislike counts |
| GET | `/api/likes/:postId/me` | Yes | Get user's reaction |
| POST | `/api/likes/:postId` | Yes | Toggle like/dislike |

### Other

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/authors` | No | List authors |
| POST | `/api/subscribers` | No | Subscribe email |
| GET | `/` | No | Health check |

---

## Database Schema

### `posts`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| title | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE |
| content | TEXT | NOT NULL |
| excerpt | TEXT | |
| cover_image | TEXT | |
| author_id | INT | FK → authors |
| tags | TEXT[] | |
| published | BOOLEAN | DEFAULT false |

### `admins` / `users`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | TEXT | bcrypt hashed |
| reset_token | TEXT | nullable |
| reset_token_expiry | TIMESTAMP | nullable |

### `comments`
- `post_id` INT FK → posts, `user_id` INT FK → users, `content` TEXT

### `likes`
- `post_id` INT FK → posts, `user_id` INT FK → users, `type` CHECK ('like','dislike')
- UNIQUE(post_id, user_id)

### `subscribers`
- `email` TEXT UNIQUE

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Node.js, Express 5, ES Modules |
| **Database** | PostgreSQL (Neon) via `pg` |
| **Auth** | JWT (`jsonwebtoken`) + bcryptjs |
| **Email** | Nodemailer (Gmail SMTP) |
| **Frontend** | React 19, Vite 8 |
| **Styling** | Tailwind CSS 4 + Typography |
| **Markdown** | react-markdown |
| **Icons** | react-icons (Ionicons 5) |
| **Routing** | react-router-dom v7 |

---

## Quick Start

```bash
# Backend
cd Backend
npm install
# Edit Backend/.env with DB URL + JWT secret + email creds
npm run dev

# Frontend
cd Frontend
npm install
# Edit Frontend/.env.production with API URL
npm run dev
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `ADMIN_SECRET_KEY` | Yes | Key required for admin registration |
| `EMAIL_USER` | Yes | Gmail address for Nodemailer |
| `EMAIL_PASS` | Yes | Gmail app password |
| `FRONTEND_URL` | No | CORS origin |
| `VITE_API_URL` | Yes | Frontend → backend API base URL |

---

## Project Structure

```
├── Backend/
│   ├── server.js                    # Express app + routes
│   ├── database/
│   │   ├── db.js                    # pg Pool
│   │   └── schema.js               # CREATE TABLE statements
│   ├── middleware/auth_v.js         # JWT protect middleware
│   └── routes/
│       ├── auth.js                  # Admin auth
│       ├── users.js                 # User auth
│       ├── posts.js                 # Post CRUD
│       ├── authors.js               # Author CRUD
│       ├── comments.js              # Comment CRUD
│       ├── likes.js                 # Like/dislike
│       └── subscribers.js           # Email subscription
└── Frontend/
    ├── src/
    │   ├── components/              # Header, Footer, Blogs, Search, etc.
    │   ├── pages/                   # 14 pages (Home, Blog, Admin, Login, etc.)
    │   ├── services/api.js          # fetch wrapper
    │   ├── hooks/useAuth.js         # Auth helpers
    │   ├── App.jsx                  # Routes
    │   └── main.jsx                 # Entry
    ├── vite.config.js               # Dev proxy to :5000
    ├── render.yaml
    └── public/_redirects            # SPA fallback
```

---

## Deployment

- **Backend + Frontend**: Render via `render.yaml` — Node web service + static site
