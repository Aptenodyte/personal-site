# Deployment Guide

## Prerequisites
- Node.js 18+
- A PostgreSQL database (local or hosted — e.g. Vercel Postgres, Supabase, Neon, Railway)

## Environment Variables

Create a `.env` file (or set these in your hosting platform's dashboard):

```env
# Database (required)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Admin passphrase for comment moderation (required)
ADMIN_PASSPHRASE=choose-a-strong-random-passphrase
```

## Optional: Email Notifications

Set these to get emailed when someone comments or sends you a message.
The site works fine without them — it just won't send notifications.

For Gmail, use an **App Password** (not your regular password):
1. myaccount.google.com → Security → enable 2-Step Verification
2. Search "App passwords" → create one for "Mail"

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

## Deploy Steps

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start the production server
npm run start
```

The database tables (messages, comments) are created automatically
on the first request — no manual migration needed.

## Post-Deploy Checklist
- [ ] Set DATABASE_URL to your production database
- [ ] Set ADMIN_PASSPHRASE to a strong random string
- [ ] Set SMTP_* vars if you want email notifications
- [ ] Test the contact form at /contact
- [ ] Test comments on a blog post
- [ ] Test admin login at /admin
- [ ] Verify your social links are correct in src/lib/site.ts
