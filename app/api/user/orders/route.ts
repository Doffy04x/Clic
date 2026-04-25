import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

// GET /api/user/orders — fetch orders for the logged-in user
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
  });

  const data = orders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: order.status.toLowerCase(),
    total: order.total,
    items: order.items.map(item => ({
      name: item.product.name,
      color: (item.selectedColor as { name?: string })?.name ?? '',
      qty: item.quantity,
      price: item.price,
    })),
  }));

  return NextResponse.json({ success: true, data });
}
