-- ============================================================
-- Clic Optique — Migration complète PostgreSQL
-- À exécuter sur : console.neon.tech → SQL Editor
-- Ou via : npx prisma db push (depuis ton ordinateur local)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ──────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'STAFF');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "ProductCategory" AS ENUM ('EYEGLASSES', 'SUNGLASSES', 'SPORTS', 'KIDS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FrameShape" AS ENUM ('SQUARE','ROUND','OVAL','CAT_EYE','AVIATOR','WAYFARER','BROWLINE','GEOMETRIC','RECTANGLE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FrameMaterial" AS ENUM ('ACETATE','METAL','TITANIUM','TR90','WOOD','MIXED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FrameType" AS ENUM ('FULL_RIM','SEMI_RIM','RIMLESS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "Gender" AS ENUM ('MEN','WOMEN','UNISEX');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "AppointmentType" AS ENUM ('EYE_EXAM','FRAME_FITTING','LENS_CONSULTATION','REPAIR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING','CONFIRMED','CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE','FIXED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','PAID','FAILED','REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── USERS & AUTH ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "User" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "name"          TEXT,
  "email"         TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP,
  "image"         TEXT,
  "passwordHash"  TEXT,
  "role"          "UserRole" NOT NULL DEFAULT 'CUSTOMER',
  "phone"         TEXT,
  "dateOfBirth"   TIMESTAMP,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastLogin"     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id"                TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId"            TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT NOT NULL UNIQUE,
  "expires"    TIMESTAMP NOT NULL,
  UNIQUE("identifier", "token")
);

-- ─── PRODUCTS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Product" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "slug"             TEXT NOT NULL UNIQUE,
  "name"             TEXT NOT NULL,
  "brand"            TEXT NOT NULL,
  "category"         "ProductCategory" NOT NULL,
  "price"            DOUBLE PRECISION NOT NULL,
  "compareAtPrice"   DOUBLE PRECISION,
  "description"      TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "images"           TEXT[] NOT NULL DEFAULT '{}',
  "modelFile"        TEXT,
  "frameShape"       "FrameShape" NOT NULL,
  "frameType"        "FrameType" NOT NULL,
  "material"         "FrameMaterial" NOT NULL,
  "gender"           "Gender" NOT NULL,
  "colors"           JSONB NOT NULL DEFAULT '[]',
  "lensOptions"      JSONB NOT NULL DEFAULT '[]',
  "faceShapeRec"     TEXT[] NOT NULL DEFAULT '{}',
  "tags"             TEXT[] NOT NULL DEFAULT '{}',
  "specifications"   JSONB NOT NULL DEFAULT '{}',
  "stock"            INTEGER NOT NULL DEFAULT 0,
  "sku"              TEXT NOT NULL UNIQUE,
  "rating"           DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reviewCount"      INTEGER NOT NULL DEFAULT 0,
  "featured"         BOOLEAN NOT NULL DEFAULT false,
  "bestSeller"       BOOLEAN NOT NULL DEFAULT false,
  "newArrival"       BOOLEAN NOT NULL DEFAULT false,
  "onSale"           BOOLEAN NOT NULL DEFAULT false,
  "salePercentage"   INTEGER,
  "createdAt"        TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_product_category"   ON "Product"("category");
CREATE INDEX IF NOT EXISTS "idx_product_brand"      ON "Product"("brand");
CREATE INDEX IF NOT EXISTS "idx_product_slug"       ON "Product"("slug");
CREATE INDEX IF NOT EXISTS "idx_product_featured"   ON "Product"("featured");

-- ─── ORDERS ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Order" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "orderNumber"     TEXT NOT NULL UNIQUE,
  "userId"          TEXT REFERENCES "User"("id"),
  "customerEmail"   TEXT NOT NULL,
  "status"          "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "subtotal"        DOUBLE PRECISION NOT NULL,
  "tax"             DOUBLE PRECISION NOT NULL,
  "shipping"        DOUBLE PRECISION NOT NULL,
  "discount"        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total"           DOUBLE PRECISION NOT NULL,
  "paymentIntentId" TEXT UNIQUE,
  "trackingNumber"  TEXT,
  "notes"           TEXT,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_order_userId"    ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "idx_order_email"     ON "Order"("customerEmail");
CREATE INDEX IF NOT EXISTS "idx_order_status"    ON "Order"("status");
CREATE INDEX IF NOT EXISTS "idx_order_createdAt" ON "Order"("createdAt");

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "orderId"       TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId"     TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity"      INTEGER NOT NULL,
  "price"         DOUBLE PRECISION NOT NULL,
  "selectedColor" JSONB NOT NULL,
  "selectedLens"  JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_orderitem_orderId" ON "OrderItem"("orderId");

CREATE TABLE IF NOT EXISTS "ShippingAddress" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "orderId"    TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
  "firstName"  TEXT NOT NULL,
  "lastName"   TEXT NOT NULL,
  "email"      TEXT NOT NULL,
  "phone"      TEXT NOT NULL,
  "address1"   TEXT NOT NULL,
  "address2"   TEXT,
  "city"       TEXT NOT NULL,
  "state"      TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country"    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "BillingAddress" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "orderId"    TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
  "firstName"  TEXT NOT NULL,
  "lastName"   TEXT NOT NULL,
  "email"      TEXT NOT NULL,
  "phone"      TEXT NOT NULL,
  "address1"   TEXT NOT NULL,
  "address2"   TEXT,
  "city"       TEXT NOT NULL,
  "state"      TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country"    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "orderId"   TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "status"    "OrderStatus" NOT NULL,
  "note"      TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_statushistory_orderId" ON "OrderStatusHistory"("orderId");

-- ─── PAYMENT ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Payment" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "orderId"       TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
  "provider"      TEXT NOT NULL DEFAULT 'CMI',
  "transactionId" TEXT,
  "amount"        DOUBLE PRECISION NOT NULL,
  "currency"      TEXT NOT NULL DEFAULT 'MAD',
  "status"        "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "rawResponse"   JSONB,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── REVIEWS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Review" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "userId"    TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "rating"    INTEGER NOT NULL,
  "title"     TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "verified"  BOOLEAN NOT NULL DEFAULT false,
  "helpful"   INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("productId", "userId")
);

CREATE INDEX IF NOT EXISTS "idx_review_productId" ON "Review"("productId");
CREATE INDEX IF NOT EXISTS "idx_review_rating"    ON "Review"("rating");

-- ─── WISHLIST ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Wishlist" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "addedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

-- ─── CART PERSISTÉ ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "CartItem" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "quantity"  INTEGER NOT NULL,
  "color"     TEXT,
  "lensType"  TEXT,
  "addedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "productId", "color", "lensType")
);

CREATE INDEX IF NOT EXISTS "idx_cartitem_userId" ON "CartItem"("userId");

-- ─── ADDRESSES ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Address" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId"     TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "label"      TEXT NOT NULL DEFAULT 'Domicile',
  "firstName"  TEXT NOT NULL,
  "lastName"   TEXT NOT NULL,
  "address1"   TEXT NOT NULL,
  "address2"   TEXT,
  "city"       TEXT NOT NULL,
  "state"      TEXT NOT NULL DEFAULT 'Casablanca',
  "postalCode" TEXT NOT NULL,
  "country"    TEXT NOT NULL DEFAULT 'MA',
  "isDefault"  BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS "idx_address_userId" ON "Address"("userId");

-- ─── APPOINTMENTS ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Appointment" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId"    TEXT REFERENCES "User"("id"),
  "type"      "AppointmentType" NOT NULL,
  "date"      TIMESTAMP NOT NULL,
  "time"      TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName"  TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "phone"     TEXT NOT NULL,
  "notes"     TEXT,
  "status"    "AppointmentStatus" NOT NULL DEFAULT 'CONFIRMED',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_appointment_date"  ON "Appointment"("date");
CREATE INDEX IF NOT EXISTS "idx_appointment_email" ON "Appointment"("email");

-- ─── NEWSLETTER ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "email"        TEXT NOT NULL UNIQUE,
  "userId"       TEXT UNIQUE REFERENCES "User"("id"),
  "firstName"    TEXT,
  "active"       BOOLEAN NOT NULL DEFAULT true,
  "subscribedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── COUPONS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Coupon" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "code"          TEXT NOT NULL UNIQUE,
  "description"   TEXT NOT NULL,
  "discountType"  "DiscountType" NOT NULL,
  "discountValue" DOUBLE PRECISION NOT NULL,
  "minOrderValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "maxUses"       INTEGER,
  "usedCount"     INTEGER NOT NULL DEFAULT 0,
  "expiresAt"     TIMESTAMP,
  "active"        BOOLEAN NOT NULL DEFAULT true,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_coupon_code" ON "Coupon"("code");

-- ─── INVENTORY LOG ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "InventoryLog" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "delta"     INTEGER NOT NULL,
  "reason"    TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_inventorylog_productId" ON "InventoryLog"("productId");

-- ─── ABANDONED CARTS ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "AbandonedCart" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "email"          TEXT NOT NULL,
  "userId"         TEXT,
  "items"          JSONB NOT NULL,
  "reminderSentAt" TIMESTAMP,
  "convertedAt"    TIMESTAMP,
  "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_abandonedcart_email"          ON "AbandonedCart"("email");
CREATE INDEX IF NOT EXISTS "idx_abandonedcart_reminderSentAt" ON "AbandonedCart"("reminderSentAt");

-- ─── ADMIN USER (à personnaliser) ───────────────────────────
-- INSERT INTO "User" ("id","email","name","role","passwordHash","createdAt","updatedAt")
-- VALUES (
--   gen_random_uuid()::text,
--   'admin@clicoptique.ma',
--   'Admin Clic Optique',
--   'ADMIN',
--   '$2b$12$REMPLACER_PAR_HASH_BCRYPT',
--   NOW(), NOW()
-- );

SELECT 'Migration terminée avec succès ✓' as status;
