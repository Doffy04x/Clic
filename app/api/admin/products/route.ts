import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function requireAdmin(session: Session | null) {
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/products — list all products
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const authError = requireAdmin(session);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '50');
  const q = searchParams.get('q') ?? '';

  const where = q ? {
    OR: [
      { name: { contains: q, mode: 'insensitive' as const } },
      { brand: { contains: q, mode: 'insensitive' as const } },
      { sku: { contains: q, mode: 'insensitive' as const } },
    ],
  } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: products,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

// POST /api/admin/products — create product
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const authError = requireAdmin(session);
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now(),
        brand: body.brand,
        category: body.category?.toUpperCase().replace('-', '_') ?? 'EYEGLASSES',
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        description: body.description ?? '',
        shortDescription: body.shortDescription ?? '',
        images: body.images ?? [],
        frameShape: body.frameShape?.toUpperCase().replace('-', '_') ?? 'SQUARE',
        frameType: body.frameType?.toUpperCase().replace('-', '_') ?? 'FULL_RIM',
        material: body.material?.toUpperCase().replace('-', '').replace('90', '90') ?? 'ACETATE',
        gender: body.gender?.toUpperCase() ?? 'UNISEX',
        colors: body.colors ?? [],
        lensOptions: body.lensOptions ?? [],
        faceShapeRec: body.faceShapeRecommendation ?? [],
        tags: body.tags ?? [],
        specifications: body.specifications ?? {},
        stock: parseInt(body.stock) || 0,
        sku: body.sku || `SKU-${Date.now()}`,
        featured: body.featured ?? false,
        bestSeller: body.bestSeller ?? false,
        newArrival: body.newArrival ?? true,
        onSale: body.onSale ?? false,
        salePercentage: body.salePercentage ? parseInt(body.salePercentage) : null,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
