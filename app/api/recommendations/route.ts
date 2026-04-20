import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, FACE_SHAPE_GUIDES } from '@/lib/products';
import type { FaceShape } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const faceShape = searchParams.get('faceShape') as FaceShape | null;
  const productId = searchParams.get('productId');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '6'), 12);

  // Face shape recommendations
  if (faceShape) {
    const guide = FACE_SHAPE_GUIDES[faceShape];
    if (!guide) {
      return NextResponse.json({ success: false, error: 'Unknown face shape' }, { status: 400 });
    }

    const recommended = PRODUCTS
      .filter(p => p.faceShapeRecommendation.includes(faceShape))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: recommended,
      guide: {
        description: guide.description,
        recommendedShapes: guide.recommended,
        avoidShapes: guide.avoid,
      },
    });
  }

  // Related product recommendations
  if (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const related = PRODUCTS
      .filter(p =>
        p.id !== productId &&
        (p.category === product.category ||
          p.frameShape === product.frameShape ||
          p.brand === product.brand)
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return NextResponse.json({ success: true, data: related });
  }

  // General best sellers as fallback
  const fallback = PRODUCTS
    .filter(p => p.bestSeller || p.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  return NextResponse.json({ success: true, data: fallback });
}
