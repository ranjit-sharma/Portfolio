# Ranjit Sharma — Portfolio

A production-quality full-stack portfolio website built with the **MERN stack**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS v3, Framer Motion, React Router v6, Axios, Lucide React |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT in HTTP-only cookies, bcrypt |
| Validation | Zod (server), client-side inline |
| Email | Nodemailer (optional, graceful no-op without SMTP config) |
| Security | Helmet, CORS, rate limiting, express-mongo-sanitize |

---

## Project Structure.

```
Portfolio/
├── client/                     ← Vite + React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── navigation/     ← Navbar, Footer
│   │   │   └── ui/             ← Shared primitives (Button, Card, Badge…)
│   │   ├── context/            ← ThemeContext, AuthContext
│   │   ├── hooks/              ← useInView, useScrollSpy
│   │   ├── layouts/            ← RootLayout, AdminLayout
│   │   ├── pages/              ← Home, AdminDashboard, AdminProjects…
│   │   ├── sections/           ← Hero, About, Skills, Experience, Projects…
│   │   ├── services/           ← Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     ← Express REST API
    ├── scripts/
    │   ├── createAdmin.js      ← One-time admin provisioning
    │   └── seedData.js         ← Initial portfolio data seed
    ├── src/
    │   ├── config/db.js        ← MongoDB connection
    │   ├── controllers/        ← auth, project, experience, skill,
    │   │                          certification, contact, profile
    │   ├── middleware/         ← auth.js, errorHandler.js,
    │   │                          rateLimiter.js, validate.js
    │   ├── models/             ← Admin, Project, Experience, Skill,
    │   │                          Certification, ContactMessage, Profile
    │   ├── routes/             ← public.routes.js, admin.routes.js
    │   ├── services/           ← email.service.js
    │   ├── utils/              ← asyncHandler, apiResponse, slugify
    │   ├── app.js
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env` — replace these values:

```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/portfolio
JWT_SECRET=<64-character random string>
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=YourSecurePassword123!
CLIENT_URL=http://localhost:5173
```

Install dependencies:
```bash
npm install
```

### 3. Create Admin Account

```bash
npm run create-admin
```

> ⚠️ Run this **once only**. Sets up the admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

### 4. Seed Initial Portfolio Data

```bash
npm run seed-data
```

> Seeds skills, experience, projects, certifications, and profile defaults. Safe to run multiple times — skips existing data.

### 5. Start the Server

```bash
npm run dev       # development (nodemon)
npm start         # production
```

Server runs on **http://localhost:5000**

### 6. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

> The Vite dev proxy automatically forwards `/api` requests to `http://localhost:5000`.

---

## Environment Variables (Server)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens (≥64 chars) |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `COOKIE_MAX_AGE` | No | Cookie max age in ms (default: 7 days) |
| `CLIENT_URL` | ✅ | Frontend origin for CORS |
| `ADMIN_EMAIL` | Script only | Used by `createAdmin.js` |
| `ADMIN_PASSWORD` | Script only | Used by `createAdmin.js` |
| `SMTP_HOST` | No | Email host for contact form |
| `SMTP_PORT` | No | Email port (default: 587) |
| `SMTP_USER` | No | Email username |
| `SMTP_PASSWORD` | No | Email password / app password |
| `CONTACT_RECEIVER_EMAIL` | No | Where contact form emails are delivered |

---

## API Endpoints

### Public (no auth)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/profile` | Get profile/settings |
| GET | `/api/v1/projects` | List all active projects |
| GET | `/api/v1/projects/:slug` | Get project by slug |
| GET | `/api/v1/skills` | List all skills |
| GET | `/api/v1/experience` | List all experience |
| GET | `/api/v1/certifications` | List all certifications |
| POST | `/api/v1/contact` | Submit contact form |

### Admin (JWT cookie required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/login` | Login (rate-limited) |
| POST | `/api/v1/admin/logout` | Logout |
| GET | `/api/v1/admin/me` | Get current admin |
| PUT | `/api/v1/admin/profile` | Update profile |
| GET/POST/PUT/DELETE | `/api/v1/admin/projects` | CRUD projects |
| GET/POST/PUT/DELETE | `/api/v1/admin/experience` | CRUD experience |
| GET/POST/PUT/DELETE | `/api/v1/admin/skills` | CRUD skills |
| GET/POST/PUT/DELETE | `/api/v1/admin/certifications` | CRUD certifications |
| GET | `/api/v1/admin/messages` | List contact messages |
| PATCH | `/api/v1/admin/messages/:id/status` | Update message status |
| DELETE | `/api/v1/admin/messages/:id` | Delete message |

---

## Admin Dashboard

Navigate to **http://localhost:5173/admin/login** and sign in with the credentials you set during admin creation.

Dashboard sections:
- **Projects** — Full CRUD with technology tags, links, featured flag
- **Experience** — Timeline management with responsibilities and tech tags
- **Skills** — Categorized skill management
- **Certifications** — Credential management with URLs and dates
- **Messages** — View/filter contact form submissions, mark read/replied, reply by email
- **Settings** — Update profile, social links, resume URL, availability status

---

## Contact Form

The contact form:
- Validates input client-side and server-side (Zod)
- Saves submissions to MongoDB
- Optionally sends email via SMTP (requires `SMTP_*` vars — omitting them silently skips email delivery)
- Shows honest success/error states

---

## Theme System

- Dark mode (default): charcoal `#0f0f0f` background, `#c5f467` lime accent
- Light mode: off-white background, muted accent
- Persisted in `localStorage`
- OS preference respected on first visit
- Theme applied before React mounts — no flash

---

## Deployment Checklist

1. Set `NODE_ENV=production` on server
2. Update `CLIENT_URL` to your production domain
3. Configure `MONGODB_URI` with production Atlas cluster
4. Generate a strong `JWT_SECRET` (64+ chars)
5. Run `npm run create-admin` in production environment
6. Run `npm run seed-data` for initial content
7. Build frontend: `npm run build` → deploy `dist/` folder to static host (Vercel, Netlify, etc.)
8. Deploy server to Render, Railway, or similar
9. Configure SMTP for email delivery (optional)
10. Set resume URL in admin Settings panel

---

## Security Measures

- Passwords hashed with bcrypt (12 salt rounds)
- JWT in HTTP-only, SameSite cookies
- Helmet security headers
- CORS restricted to known origins
- express-mongo-sanitize (NoSQL injection protection)
- Rate limiting on login (10 req/15min) and contact form (5 req/hour)
- No secrets in frontend code
- All admin routes server-side protected

---

## Tests Performed

| Test | Result |
|---|---|
| `npm run build` — client | ✅ Passes with no errors |
| Server syntax check (`node --check`) | ✅ All files pass |
| Server starts, handles missing MongoDB gracefully | ✅ Exits cleanly with clear error |
| All public API route handlers defined | ✅ |
| Admin auth middleware isolates protected routes | ✅ |
| Contact form server+client validation | ✅ |
| Theme toggle (dark/light) | ✅ |
| Mobile responsive navbar drawer | ✅ |
| Framer Motion animations import | ✅ (build includes framer-motion) |
| React Router routing (public + admin) | ✅ |

---

## License

Personal portfolio — all rights reserved.
