import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Convert DB uppercase enums → frontend lowercase strings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(p: any) {
  return {
    ...p,
    category: p.category?.toLowerCase().replace('_', '-') ?? 'eyeglasses',
    frameShape: p.frameShape?.toLowerCase().replace('_', '-') ?? 'square',
    frameType: p.frameType?.toLowerCase().replace('_', '-') ?? 'full-rim',
    material: p.material?.toLowerCase() ?? 'acetate',
    gender: p.gender?.toLowerCase() ?? 'unisex',
    faceShapeRecommendation: p.faceShapeRec ?? [],
    images: p.images ?? [],
    colors: p.colors ?? [],
    lensOptions: p.lensOptions ?? [],
    tags: p.tags ?? [],
    specifications: p.specifications ?? {},
    reviews: [],
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    tryOnImage: p.tryOnImage ?? null,
    createdAt: p.createdAt ?? new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '12'), 200);
  const sort = searchParams.get('sort') ?? 'featured';
  const query = searchParams.get('q') ?? '';
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  // Single product by slug
  if (slug) {
    const product = await prisma.product.findFirst({ where: { slug } });
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: normalize(product) });
  }

  // Single product by id
  if (id) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: normalize(product) });
  }

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  const category = searchParams.get('category');
  if (category) {
    const cats = category.split(',').map(c => c.toUpperCase().replace('-', '_'));
    where.category = { in: cats };
  }

  const gender = searchParams.get('gender');
  if (gender) {
    where.gender = { in: gender.split(',').map(g => g.toUpperCase()) };
  }

  const frameShape = searchParams.get('frameShape');
  if (frameShape) {
    where.frameShape = { in: frameShape.split(',').map(s => s.toUpperCase().replace('-', '_')) };
  }

  const material = searchParams.get('material');
  if (material) {
    where.material = { in: material.split(',').map(m => m.toUpperCase()) };
  }

  const frameType = searchParams.get('frameType');
  if (frameType) {
    where.frameType = { in: frameType.split(',').map(t => t.toUpperCase().replace('-', '_')) };
  }

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) where.price.gte = parseFloat(priceMin);
    if (priceMax) where.price.lte = parseFloat(priceMax);
  }

  if (searchParams.get('onSale') === 'true') where.onSale = true;
  if (searchParams.get('newArrival') === 'true') where.newArrival = true;
  if (searchParams.get('featured') === 'true') where.featured = true;
  if (searchParams.get('inStock') === 'true') where.stock = { gt: 0 };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } },
      { sku: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Sorting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  else if (sort === 'price-desc') orderBy = { price: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };
  else if (sort === 'featured') orderBy = [{ featured: 'desc' }, { bestSeller: 'desc' }, { createdAt: 'desc' }];
  else if (sort === 'best-seller') orderBy = { bestSeller: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: products.map(normalize),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
