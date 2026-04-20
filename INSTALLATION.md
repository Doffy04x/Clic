# Installation Guide — Clic Optique

Complete step-by-step instructions for setting up Clic Optique on your local machine.

---

## Prerequisites

Before starting, make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18.17+ | https://nodejs.org |
| **npm** | 9+ (comes with Node) | — |
| **Git** | Any recent version | https://git-scm.com |
| **PostgreSQL** | 14+ | https://www.postgresql.org/download/ |

**Optional but recommended:**
- [VS Code](https://code.visualstudio.com/) with the Prisma extension
- [TablePlus](https://tableplus.com/) or [pgAdmin](https://www.pgadmin.org/) for database GUI

---

## Step 1 — Clone and Install Dependencies

```bash
# Navigate to your projects folder
cd ~/projects

# Install dependencies
cd clic-optique
npm install
```

This will install all ~40 packages including Next.js, Prisma, Three.js, MediaPipe, Stripe, and NextAuth.

> **Note:** The install may take 1–3 minutes. You will see some peer dependency warnings — these are safe to ignore.

---

## Step 2 — Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Now open `.env.local` in your editor and fill in each value:

### 2a. Database (Required)

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/clicoptique"
```

Replace `YOUR_USER` and `YOUR_PASSWORD` with your PostgreSQL credentials.

**Create the database:**
```bash
psql -U postgres -c "CREATE DATABASE clicoptique;"
```

### 2b. NextAuth (Required)

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2c. Google OAuth (Optional — needed for "Sign in with Google")

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** → APIs & Services → Library
4. Create credentials → OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

> **Skip this step** if you only need email/password login. Google OAuth can be added later.

### 2d. Stripe Payments (Optional — needed for checkout)

1. Create account at [stripe.com](https://stripe.com)
2. Go to Dashboard → Developers → API keys
3. Copy the test keys:

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

For the webhook (needed for order confirmation):
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Listen for webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret shown in the terminal:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2e. Email / SMTP (Optional — needed for order emails)

For development, use [Mailtrap](https://mailtrap.io/) (free):

1. Sign up at mailtrap.io
2. Go to Inboxes → SMTP Settings
3. Copy credentials:

```env
EMAIL_HOST="smtp.mailtrap.io"
EMAIL_PORT="587"
EMAIL_USER="your-mailtrap-user"
EMAIL_PASSWORD="your-mailtrap-password"
EMAIL_FROM="noreply@clicoptique.com"
```

For production, use [Resend](https://resend.com/) or [SendGrid](https://sendgrid.com/).

---

## Step 3 — Set Up the Database

```bash
# Generate Prisma client (always run after schema changes)
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Seed with demo data (products, admin user, coupons)
npm run db:seed
```

Expected output:
```
🌱 Seeding database...

✅ Admin user: admin@clicoptique.com
✅ Demo customer: demo@example.com
✅ 8 products seeded
✅ 4 coupons seeded

🎉 Database seeded successfully!

Admin login:
  Email: admin@clicoptique.com
  Password: ClicOptique2024!
```

### Verify the database

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

This opens http://localhost:5555 where you can browse all tables.

---

## Step 4 — Start the Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** — the site should be live.

### Available URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| Shop | http://localhost:3000/shop |
| Virtual Try-On | http://localhost:3000/virtual-try-on |
| Cart | http://localhost:3000/cart |
| Admin Dashboard | http://localhost:3000/admin |
| Login | http://localhost:3000/auth/login |
| Register | http://localhost:3000/auth/register |

---

## Step 5 — Test the Application

### Test user login
- Email: `demo@example.com`
- Password: `demo123`

### Test admin login
- Email: `admin@clicoptique.com`
- Password: `ClicOptique2024!`

### Test Stripe payment
Use Stripe's test card numbers:
- **Success:** `4242 4242 4242 4242` — any future date — any 3-digit CVC
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

### Test coupon codes
- `WELCOME10` — 10% off any order
- `SUMMER20` — 20% off
- `FREESHIP` — Free shipping
- `VIP50` — €50 off orders over €200

---

## Step 6 — Virtual Try-On Setup

The virtual try-on uses your device's camera with MediaPipe FaceMesh, loaded from CDN. No additional setup is required — it loads automatically when you visit `/virtual-try-on`.

**Browser requirements:**
- Chrome 88+, Firefox 87+, Safari 14+, Edge 88+
- HTTPS required in production (localhost works in development)
- Camera permission must be granted

**Mobile:**
- Works on iOS Safari 14+ and Android Chrome
- Front-facing camera is used automatically

---

## Troubleshooting

### `Error: Cannot find module '@prisma/client'`
```bash
npx prisma generate
```

### `Error: P1001 - Can't reach database server`
Check that PostgreSQL is running:
```bash
# macOS (Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
net start postgresql
```

### `TypeError: fetch is not a function` (Node < 18)
Upgrade to Node.js 18+:
```bash
node --version  # check current version
# Use nvm to upgrade: nvm install 18 && nvm use 18
```

### Port 3000 already in use
```bash
# Run on a different port
npm run dev -- -p 3001
```

### Google OAuth redirect mismatch
Make sure the redirect URI in Google Console exactly matches:
`http://localhost:3000/api/auth/callback/google`

### MediaPipe camera not working
- Check browser permissions (camera must be allowed)
- Try opening DevTools → Console for error messages
- Ensure you're using `localhost` not `127.0.0.1` (some browsers treat them differently for camera permissions)

### Stripe webhook `400 No signatures found`
Run `stripe listen` in a separate terminal before testing checkout:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with demo data
npm run db:reset     # Reset and re-seed database
npx prisma studio    # Open visual database browser
npx prisma migrate dev  # Create and apply a new migration
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ Yes | Full URL of your app |
| `NEXTAUTH_SECRET` | ✅ Yes | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Optional | For Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Optional | For Google OAuth |
| `STRIPE_SECRET_KEY` | Optional | Stripe server-side key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe client-side key |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook signing secret |
| `EMAIL_HOST` | Optional | SMTP server host |
| `EMAIL_PORT` | Optional | SMTP port (usually 587 or 465) |
| `EMAIL_USER` | Optional | SMTP username |
| `EMAIL_PASSWORD` | Optional | SMTP password |
| `EMAIL_FROM` | Optional | Sender email address |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary for image uploads |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret |
| `GOOGLE_MAPS_API_KEY` | Optional | For store location map |

---

*For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)*
