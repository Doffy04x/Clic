import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

// GET /api/user/profile — fetch current user's profile
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: 'Utilisateur introuvable' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...user,
      role: user.role.toLowerCase(),
      totalOrders: user._count.orders,
    },
  });
}

// PUT /api/user/profile — update name / phone
export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone } = body as { name?: string; phone?: string };

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(phone !== undefined && { phone: phone.trim() || null }),
    },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json({ success: true, data: updated });
}
