# Siruthuli Foundation Website

A Vue 3 + TypeScript charity foundation website with a public transparency portal and admin panel.

## Stack

- **Frontend:** Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router, Axios, Chart.js
- **Backend:** Firebase (Firestore + Storage) — optional, falls back to mock data
- **Admin Auth:** JSON file credentials (no Firebase Auth, no database)

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Admin Login

Credentials are loaded from `public/data/admin-credentials.json`:

```json
{
  "allowedUsers": [
    {
      "email": "roganinnovator@gmail.com",
      "password": "your-password"
    }
  ]
}
```

1. Copy `public/data/admin-credentials.example.json` → `public/data/admin-credentials.json`
2. Edit email/password
3. Login at `/admin/login`

> **Note:** This file is gitignored. For production, restrict access to this file or use server-side auth.

## Firebase Setup (Optional)

Copy `.env.example` to `.env` and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Without Firebase, the app runs with in-memory mock data (resets on page refresh).

## Project Structure

```
src/
├── api/
├── assets/
├── components/
│   ├── common/
│   ├── cards/
│   ├── charts/
│   ├── tables/
│   └── forms/
├── composables/
├── data/
├── firebase/
├── layouts/
├── pages/
│   ├── public/
│   └── admin/
├── router/
├── services/
├── stores/
├── types/
└── utils/
```

## Pages

| Public | Admin |
|--------|-------|
| Home | Dashboard |
| About | Donations CRUD |
| Contributions | Contributions CRUD |
| Transparency | Expenses CRUD |
| Gallery | Settings |
| Contact | Login |

## Theme

- Primary: Emerald Green (`#059669`)
- Accent: Warm Orange (`#f97316`)
- Background: Soft Gray

## Deploy

### GitHub Pages (automatic)

Pushes to `main` deploy via GitHub Actions to:

**https://roganrajn.github.io/siruthuli/**

Enable once in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Local build

```bash
npm run build
```

For a production-like build matching GitHub Pages:

```bash
VITE_BASE_PATH=/siruthuli/ npm run build
```

Deploy the `dist/` folder to any static host.

### Admin login on GitHub Pages

`admin-credentials.json` is not committed (gitignored). For admin login on the live site, add credentials via Firebase later, or temporarily add `public/data/admin-credentials.json` before deploy (not recommended — file is publicly readable on static hosting).
