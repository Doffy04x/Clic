import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

function requireAdmin(session: Session | null) {
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Accès refusé' }, { status: 403 });
  }
  return null;
}

// GET /api/admin/lenses — list all lens templates
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;
  const denied = requireAdmin(session);
  if (denied) return denied;

  const lenses = await prisma.lensTemplate.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return NextResponse.json({ success: true, data: lenses });
}

// POST /api/admin/lenses — create a new lens template
export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const denied = requireAdmin(session);
  if (denied) return denied;

  const body = await req.json();
  const { name, category, description, price, features, sortOrder, active } = body;

  if (!name?.trim() || !category?.trim()) {
    return NextResponse.json({ success: false, error: 'Nom et catégorie requis' }, { status: 400 });
  }

  const lens = await prisma.lensTemplate.create({
    data: {
      name: name.trim(),
      category: category.trim(),
      description: description?.trim() || null,
      price: Number(price) || 0,
      features: Array.isArray(features) ? features.filter(Boolean) : [],
      sortOrder: Number(sortOrder) || 0,
      active: active !== false,
    },
  });

  return NextResponse.json({ success: true, data: lens }, { status: 201 });
}
