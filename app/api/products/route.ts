import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products';
import { filterProducts, sortProducts, searchProducts } from '@/lib/utils';
import type { ProductFilters, SortOption } from '@/lib/types';

// Rate limiting (simple in-memory)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '12'), 50);
  const sort = (searchParams.get('sort') ?? 'featured') as SortOption;
  const query = searchParams.get('q') ?? '';
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');

  // Single product lookup
  if (id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  }

  if (slug) {
    const product = PRODUCTS.find(p => p.slug === slug);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  }

  // Build filters from query params
  const filters: ProductFilters = {};

  const category = searchParams.get('category');
  if (category) filters.category = category.split(',') as never;

  const gender = searchParams.get('gender');
  if (gender) filters.gender = gender.split(',') as never;

  const frameShape = searchParams.get('frameShape');
  if (frameShape) filters.frameShape = frameShape.split(',') as never;

  const material = searchParams.get('material');
  if (material) filters.material = material.split(',') as never;

  const frameType = searchParams.get('frameType');
  if (frameType) filters.frameType = frameType.split(',') as never;

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin || priceMax) {
    filters.priceRange = [Number(priceMin ?? 0), Number(priceMax ?? 9999)];
  }

  const onSale = searchParams.get('onSale');
  if (onSale === 'true') filters.onSale = true;

  const newArrival = searchParams.get('newArrival');
  if (newArrival === 'true') filters.newArrival = true;

  const featured = searchParams.get('featured');
  if (featured === 'true') filters.featured = true;

  const inStock = searchParams.get('inStock');
  if (inStock === 'true') filters.inStock = true;

  // Apply search, filter, sort
  let products = PRODUCTS;
  if (query) products = searchProducts(products, query);
  products = filterProducts(products, filters);
  products = sortProducts(products, sort);

  // Pagination
  const total = products.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const paginated = products.slice(offset, offset + pageSize);

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: { page, pageSize, total, totalPages },
  });
}

export async function POST(request: NextRequest) {
  // Admin only — create new product
  // In production: validate JWT, check admin role, validate with Zod, save to DB
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // Mock: return created product with generated ID
  const newProduct = {
    ...body,
    id: `co-${Date.now()}`,
    slug: body.name?.toLowerCase().replace(/\s+/g, '-') ?? `product-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: 0,
    reviewCount: 0,
    featured: false,
    bestSeller: false,
    newArrival: true,
  };

  return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
}
