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

// GET /api/admin/lenses/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const denied = requireAdmin(session);
  if (denied) return denied;

  const lens = await prisma.lensTemplate.findUnique({ where: { id: params.id } });
  if (!lens) return NextResponse.json({ success: false, error: 'Introuvable' }, { status: 404 });

  return NextResponse.json({ success: true, data: lens });
}

// PUT /api/admin/lenses/[id] — update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const denied = requireAdmin(session);
  if (denied) return denied;

  const body = await req.json();
  const { name, category, description, price, features, sortOrder, active } = body;

  const lens = await prisma.lensTemplate.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(category !== undefined && { category: category.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(price !== undefined && { price: Number(price) || 0 }),
      ...(features !== undefined && { features: Array.isArray(features) ? features.filter(Boolean) : [] }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
      ...(active !== undefined && { active: Boolean(active) }),
    },
  });

  return NextResponse.json({ success: true, data: lens });
}

// DELETE /api/admin/lenses/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const denied = requireAdmin(session);
  if (denied) return denied;

  await prisma.lensTemplate.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
