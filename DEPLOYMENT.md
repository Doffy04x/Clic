# Deployment Guide — Clic Optique

Production deployment instructions for Vercel, Docker, and cloud databases.

---

## Overview

Clic Optique is a Next.js 14 application. The recommended deployment stack is:

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | App hosting | Free tier available |
| **Supabase** or **Neon** | PostgreSQL database | Free tier available |
| **Stripe** | Payments | Pay-as-you-go |
| **Resend** | Transactional email | Free tier: 3,000/mo |
| **Cloudinary** | Image hosting | Free tier: 25 GB |

---

## Option 1 — Vercel (Recommended)

Vercel is built by the Next.js team and offers zero-config deployment.

### 1a. Set up a production database

**Option: Neon (recommended, serverless PostgreSQL)**

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project → Select region closest to your users
3. Copy the connection string (use the **pooled connection** for production):
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Option: Supabase**

1. Create account at [supabase.com](https://supabase.com)
2. New project → Set a strong database password
3. Go to Settings → Database → Connection string (URI format)

**Option: Railway**

1. Create account at [railway.app](https://railway.app)
2. New project → Add PostgreSQL
3. Click on the service → Variables → `DATABASE_URL`

### 1b. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (run from project root)
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: (your account)
# - Link to existing project: N
# - Project name: clic-optique
# - Directory: ./
# - Override settings: N
```

### 1c. Set environment variables

In [Vercel Dashboard](https://vercel.com/dashboard) → Your project → Settings → Environment Variables, add all variables from `.env.example`:

**Required:**
```
DATABASE_URL          = postgresql://...  (your production DB)
NEXTAUTH_URL          = https://your-domain.vercel.app
NEXTAUTH_SECRET       = (generate: openssl rand -base64 32)
```

**Payments:**
```
STRIPE_SECRET_KEY                  = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET              = whsec_...
```

**OAuth:**
```
GOOGLE_CLIENT_ID     = ...
GOOGLE_CLIENT_SECRET = ...
```

**Email:**
```
EMAIL_HOST     = smtp.resend.com
EMAIL_PORT     = 465
EMAIL_USER     = resend
EMAIL_PASSWORD = re_...  (Resend API key)
EMAIL_FROM     = noreply@yourdomain.com
```

### 1d. Run database migrations

After deploying, run migrations against your production database:

```bash
# Set the production DATABASE_URL temporarily
export DATABASE_URL="postgresql://..."

# Push schema and seed
npx prisma db push
npm run db:seed
```

Or use Vercel's build command integration by adding to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### 1e. Set up Stripe production webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the webhook signing secret → add as `STRIPE_WEBHOOK_SECRET` in Vercel

### 1f. Configure Google OAuth for production

In [Google Cloud Console](https://console.cloud.google.com/) → Your project → OAuth consent screen → Credentials:

Add to **Authorized redirect URIs**:
```
https://your-domain.vercel.app/api/auth/callback/google
```

### 1g. Custom domain (optional)

In Vercel Dashboard → Your project → Settings → Domains:
1. Add your domain (e.g., `www.clicoptique.com`)
2. Follow DNS configuration instructions (add CNAME or A records)
3. Update `NEXTAUTH_URL` to your custom domain
4. Update Google OAuth redirect URIs

---

## Option 2 — Docker

For self-hosted deployments on a VPS (DigitalOcean, Hetzner, Linode, etc.).

### Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.js` to enable standalone output:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... rest of config
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: clicoptique
      POSTGRES_PASSWORD: your_secure_password
      POSTGRES_DB: clicoptique
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Build and run

```bash
# Build the image
docker build -t clic-optique .

# Run with docker-compose
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed
```

### Nginx configuration

Create `nginx.conf`:

```nginx
events {}

http {
  server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
  }

  server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
      proxy_pass http://app:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

---

## Option 3 — AWS / GCP / Azure

### AWS (Elastic Beanstalk or App Runner)

1. Build Docker image and push to ECR:
```bash
aws ecr create-repository --repository-name clic-optique
docker tag clic-optique:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/clic-optique
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/clic-optique
```

2. Use **AWS App Runner** for simplest deployment (auto-scaling, zero config)
3. Use **Amazon RDS** (PostgreSQL) for the database
4. Use **AWS SES** for transactional email

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/clic-optique

# Deploy to Cloud Run
gcloud run deploy clic-optique \
  --image gcr.io/PROJECT_ID/clic-optique \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=...
```

---

## Post-Deployment Checklist

After deploying to production, verify the following:

### Functional tests
- [ ] Homepage loads with all images
- [ ] Shop page filters work correctly
- [ ] Product detail page + 3D viewer loads
- [ ] Add to cart works
- [ ] Checkout flow completes with Stripe test card
- [ ] Order confirmation email received
- [ ] User registration and login works
- [ ] Google OAuth works
- [ ] Virtual try-on camera activates
- [ ] Admin dashboard accessible at `/admin`
- [ ] Newsletter subscription works
- [ ] Appointment booking form submits

### Performance
- [ ] Run Lighthouse audit (target 90+ on all metrics)
- [ ] Check Core Web Vitals in Vercel Analytics
- [ ] Verify images are served via next/image optimization
- [ ] Check that 3D viewer loads lazily (not on initial page load)

### Security
- [ ] HTTPS enforced, HTTP redirects to HTTPS
- [ ] Security headers present (check with https://securityheaders.com)
- [ ] Environment variables not exposed in client bundle
- [ ] Admin route protected (returns 403 for non-admin users)
- [ ] Stripe webhook signature verification working
- [ ] Rate limiting on API routes active

### SEO
- [ ] All pages have unique `<title>` and `<meta description>`
- [ ] Product pages have JSON-LD structured data
- [ ] Open Graph images render correctly (check with https://opengraph.xyz)
- [ ] sitemap.xml accessible (if implemented)
- [ ] robots.txt in place

---

## Environment Variables — Production Values

When going from test to production, update these:

| Variable | Test value | Production value |
|----------|-----------|-----------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://yourdomain.com` |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Local CLI secret | Dashboard webhook secret |

---

## Monitoring

### Vercel Analytics
- Enabled automatically in Vercel
- View in Dashboard → Analytics

### Error tracking (recommended)
Add [Sentry](https://sentry.io) for production error monitoring:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Uptime monitoring
Use [Better Uptime](https://betteruptime.com/) or [UptimeRobot](https://uptimerobot.com/) (free) to monitor availability and get alerts on downtime.

---

*For local installation, see [INSTALLATION.md](./INSTALLATION.md)*
