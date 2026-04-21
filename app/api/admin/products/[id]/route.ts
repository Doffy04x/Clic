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

// PUT /api/admin/products/[id] — update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const authError = requireAdmin(session);
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        brand: body.brand,
        category: body.category?.toUpperCase().replace('-', '_'),
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        description: body.description,
        shortDescription: body.shortDescription,
        images: body.images,
        frameShape: body.frameShape?.toUpperCase().replace('-', '_'),
        frameType: body.frameType?.toUpperCase().replace('-', '_'),
        material: body.material?.toUpperCase(),
        gender: body.gender?.toUpperCase(),
        colors: body.colors,
        lensOptions: body.lensOptions,
        faceShapeRec: body.faceShapeRecommendation,
        tags: body.tags,
        specifications: body.specifications,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        featured: body.featured,
        bestSeller: body.bestSeller,
        newArrival: body.newArrival,
        onSale: body.onSale,
        salePercentage: body.salePercentage ? parseInt(body.salePercentage) : null,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
