# HAZY Club — Next.js + Vercel Starter

A production-ready nightclub website inspired by Ministry of Sound's feature set, themed to match **hazyclub.co.uk** (swap logo & tweak colors).

## Features
- **Events** listing with covers, lineup, time, location, ticket links, and filters.
- **Gallery** with image uploads.
- **News** (simple blog-style posts).
- **VIP / Venue Hire** info pages.
- **Newsletter sign-up** (stores to CSV-like JSON on Blob; plug into Mailchimp if you prefer).
- **Admin** backend to publish **Images**, **Events**, and **News**, protected by a single **ADMIN_PASSWORD**.
- **Vercel Blob** storage for images & JSON data (`events/*.json`, `news/*.json`, `gallery/*`).

## Quick Start (Local)
```bash
pnpm i   # or npm i / yarn
cp .env.example .env
# set ADMIN_PASSWORD and (optionally) BLOB_READ_WRITE_TOKEN for local tests
pnpm dev
```
Visit `http://localhost:3000/admin` to sign in with your admin password.

## Deploy to Vercel
1. Push this repo to **GitHub**.
2. Import to **Vercel**.
3. In Vercel → Settings → Environment Variables, set:
   - `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN` (create a Vercel Blob store and generate a **Read/Write** token)
4. Redeploy.
5. Go to `/admin` to publish content.

> **Why Blob?** Vercel functions cannot persist to filesystem. Blob gives durable storage with public URLs for images and JSON payloads.

## Theming (match hazyclub.co.uk)
Edit CSS variables in `app/globals.css` or use `brand.config.ts` to set exact colors. Replace `/public/logo.svg` with your actual logo. All components use `brand` color tokens.

## Legal / Assets
- Logo & images are placeholders. Replace with your owned assets.
- Code is MIT-licensed.
