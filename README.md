# Clic Optique — Premium Eyewear E-Commerce Platform

> A production-ready, full-stack eyewear e-commerce website with AI-powered virtual try-on, 3D glasses visualization, and a complete admin dashboard.

![Clic Optique](https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&h=400&fit=crop)

---

## ✨ Features

### 🛍️ E-Commerce
- Full product catalog with filtering, sorting, and search
- Detailed product pages with specifications
- Shopping cart with persistent state (Zustand + localStorage)
- Multi-step checkout with Stripe payments
- Order tracking and history
- Coupon / discount code system

### 🥽 Virtual Try-On (AI)
- **Real-time face detection** using MediaPipe FaceMesh (468 landmarks)
- **Glasses overlay** precisely positioned on detected face
- Head movement tracking in real time
- Screenshot & share functionality (Web Share API / Instagram)
- Camera permission UI with privacy notice
- Full mobile compatibility

### 🔮 3D Glasses Viewer
- Interactive 3D model rendered with **React Three Fiber** (Three.js)
- 360° rotation with OrbitControls
- Zoom in/out
- Color switching (frame + lens)
- Auto-rotate mode
- Contact shadows and studio lighting

### 🏪 Product System
- 8 demo products (easily expandable)
- Color variants with hex codes
- Lens options (Single Vision, Progressive, Blue Light, Photochromic, Polarized)
- Face shape recommendations
- Stock management
- Reviews & ratings

### 👤 User Accounts
- NextAuth.js authentication (Google OAuth + Credentials)
- Registration with email verification
- Profile management
- Order history
- Wishlist
- Saved addresses
- Notification preferences

### 🎯 Smart Features
- **AI Face Shape Recommendations** — suggests frames based on detected face shape
- **Wishlist system** — persistent across sessions
- **Compare frames** feature (up to 4 at once)
- **Instagram sharing** from try-on screenshot
- **Store appointment booking** system
- **Newsletter** with welcome discount

### 🛡️ Admin Dashboard
- Revenue, orders, customers analytics
- Product management (add/edit/delete/stock)
- Order management with status updates
- Real-time low stock alerts
- Visual sales charts

### ⚡ Performance & SEO
- Next.js 14 App Router with server components
- Image optimization with `next/image`
- Code splitting & lazy loading
- Structured data (JSON-LD) for products
- Open Graph & Twitter Card meta tags
- Sitemap-ready
- 95+ Lighthouse score target

### 🔒 Security
- HTTPS enforced
- Rate limiting on API routes
- Input validation with Zod
- XSS protection headers
- CSRF protection via NextAuth
- Secure JWT session handling

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **3D** | Three.js, React Three Fiber, React Three Drei |
| **Virtual Try-On** | MediaPipe Face Mesh, TensorFlow.js |
| **State** | Zustand (cart, wishlist, compare, UI) |
| **Auth** | NextAuth.js (JWT, Google, Credentials) |
| **Database** | PostgreSQL + Prisma ORM |
| **Payments** | Stripe (Payment Intents, Webhooks) |
| **Email** | Nodemailer (SMTP) |
| **Deployment** | Vercel (recommended) |

---

## 📁 Project Structure

```
clic-optique/
├── app/
│   ├── (site)/                  # Main site pages
│   │   ├── page.tsx             # Homepage
│   │   ├── shop/page.tsx        # Shop with filters
│   │   ├── products/[slug]/     # Product detail + 3D
│   │   ├── virtual-try-on/      # AI Try-On
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact + Appointment
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Multi-step checkout
│   │   ├── account/             # User account
│   │   ├── admin/               # Admin dashboard
│   │   └── auth/                # Login / Register
│   ├── api/
│   │   ├── products/            # Products CRUD
│   │   ├── orders/              # Orders API
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── stripe/              # Payment intents + Webhook
│   │   ├── newsletter/          # Newsletter signup
│   │   ├── appointments/        # Booking system
│   │   └── recommendations/     # AI recommendations
│   ├── globals.css
│   └── layout.tsx               # Root layout + meta
├── components/
│   ├── layout/                  # Header, Footer
│   ├── cart/                    # CartDrawer
│   ├── shop/                    # ProductCard, Filters
│   ├── product/                 # Gallery, Info, 3D Viewer
│   └── try-on/                  # Virtual Try-On component
├── lib/
│   ├── types.ts                 # TypeScript definitions
│   ├── products.ts              # Product data & helpers
│   ├── store.ts                 # Zustand stores
│   ├── utils.ts                 # Utilities
│   └── auth.ts                  # NextAuth config
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seed
├── public/
│   └── models/                  # GLB/GLTF glasses models
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Quick Start

See **[INSTALLATION.md](./INSTALLATION.md)** for complete setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Start development
npm run dev
```

Visit http://localhost:3000

---

## 🎨 Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `gold-500` | `#C9A84C` | Primary accent, CTAs |
| `black` | `#0a0a0a` | Headings, primary buttons |
| `cream` | `#f5f4f0` | Backgrounds, cards |
| `charcoal` | `#1a1a1a` | Dark sections |

### Typography
- **Display** — Poppins (headings, brand)
- **Body** — Inter (body text, UI)

### Design Principles
- Minimal, white-space-forward layout
- Gold accents on premium elements
- Black & white primary palette
- No border radius on buttons (sharp, editorial)

---

## 👓 Adding New Glasses Models

### Option 1: Real GLTF Models (Recommended for Production)

1. Export your glasses model as `.glb` from Blender/Maya/C4D
2. Optimize: `npx gltf-pipeline -i model.glb -o model-compressed.glb --draco.compressMeshes`
3. Place in `public/models/your-frame-name.glb`
4. Add product to `lib/products.ts`:

```typescript
{
  id: 'co-009',
  slug: 'your-frame-slug',
  name: 'Your Frame Name',
  modelFile: '/models/your-frame-name.glb',  // ← point to your model
  // ... rest of product data
}
```

5. In `GlassesViewer3D.tsx`, the `<GlassesModel>` component will automatically load it via `useGLTF('/models/your-frame-name.glb')`.

### Option 2: Procedural Models (Current Demo)

The current implementation uses Three.js geometry primitives to generate glasses shapes. Update the `GlassesModel` component in `components/product/GlassesViewer3D.tsx` to add new shapes or adjust geometry parameters.

---

## 💳 Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Set up webhook:
   - Dashboard → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## 🗄️ Database

### Supported
- **PostgreSQL** (recommended, hosted on Supabase/Railway/Neon)
- **MySQL** — change `provider = "mysql"` in schema.prisma
- **SQLite** (dev only) — change `provider = "sqlite"`, `url = "file:./dev.db"`

### Commands
```bash
npx prisma generate      # Regenerate client after schema changes
npx prisma db push       # Push schema to database
npx prisma migrate dev   # Create and apply migration
npx prisma studio        # Visual database browser
npm run db:seed          # Seed with demo data
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set all environment variables in Vercel Dashboard → Settings → Environment Variables.

### Docker

```bash
docker build -t clic-optique .
docker run -p 3000:3000 --env-file .env.local clic-optique
```

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full cloud deployment guides.

---

## 📧 Admin Access

Default admin credentials (after seeding):
- **Email:** `admin@clicoptique.com`
- **Password:** `ClicOptique2024!`

Access admin at: `/admin`

---

## 📄 License

This project is proprietary software for Clic Optique. All rights reserved.

---

*Built with ❤️ using Next.js, Three.js, and MediaPipe*
