import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/lenses — public: list active lens templates (optionally filter by ids)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll('ids');

  const lenses = await prisma.lensTemplate.findMany({
    where: {
      active: true,
      ...(ids.length > 0 && { id: { in: ids } }),
    },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });

  return NextResponse.json({ success: true, data: lenses });
}
