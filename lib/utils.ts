import type { Product, ProductFilters, SortOption } from './types';
import { PRODUCTS } from './products';

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatPrice(amount: number): string {
  // Convert internal prices (stored as EUR-equivalent) × 10 to Moroccan Dirham
  const dh = Math.round(amount * 10);
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dh) + ' DH';
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatOrderNumber(id: string): string {
  return `#CO-${id.slice(-6).toUpperCase()}`;
}

// ─── Product Filtering & Sorting ──────────────────────────────────────────────

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    if (filters.category?.length && !filters.category.includes(product.category)) return false;
    if (filters.gender?.length && !filters.gender.includes(product.gender)) return false;
    if (filters.frameShape?.length && !filters.frameShape.includes(product.frameShape)) return false;
    if (filters.material?.length && !filters.material.includes(product.material)) return false;
    if (filters.frameType?.length && !filters.frameType.includes(product.frameType)) return false;
    if (filters.brands?.length && !filters.brands.includes(product.brand)) return false;
    if (filters.onSale && !product.onSale) return false;
    if (filters.newArrival && !product.newArrival) return false;
    if (filters.featured && !product.featured) return false;
    if (filters.inStock && product.stock === 0) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }
    if (filters.faceShape?.length) {
      const hasShape = filters.faceShape.some((s) =>
        product.faceShapeRecommendation.includes(s)
      );
      if (!hasShape) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'best-rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'best-seller':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.frameShape.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

// ─── Cart Calculations ────────────────────────────────────────────────────────

export function calculateCartTotals(
  items: { price: number; quantity: number }[]
): { subtotal: number; tax: number; shipping: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.2; // 20% TVA Maroc
  const shipping = subtotal >= 150 ? 0 : 30; // Gratuit dès 1 500 DH
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}

// ─── String Helpers ───────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

// ─── Array Helpers ────────────────────────────────────────────────────────────

export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
}

// ─── SEO / Meta Helpers ───────────────────────────────────────────────────────

export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: product.brand },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `https://clicoptique.ma/products/${product.slug}`,
      priceCurrency: 'MAD',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

// ─── Local Storage ────────────────────────────────────────────────────────────

export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}

// ─── AI Face Shape Recommendation ────────────────────────────────────────────

export function recommendFramesForFaceShape(faceShape: string): Product[] {
  const shape = faceShape.toLowerCase();
  return PRODUCTS.filter((p) =>
    p.faceShapeRecommendation.includes(shape as never)
  ).slice(0, 6);
}

// ─── Generate order number ────────────────────────────────────────────────────

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `CO-${timestamp}-${random}`;
}

// ─── cn (classnames utility) ──────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
