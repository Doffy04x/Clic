import { NextRequest, NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/utils';
import type { Order, ShippingAddress, CartItem } from '@/lib/types';

// In production these come from Prisma/DB
const MOCK_ORDERS_DB: Order[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const orderId = searchParams.get('id');

  // Fetch single order
  if (orderId) {
    const order = MOCK_ORDERS_DB.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  }

  // Fetch user orders
  if (userId) {
    const userOrders = MOCK_ORDERS_DB.filter(o => o.userId === userId);
    return NextResponse.json({
      success: true,
      data: userOrders,
      pagination: { page: 1, pageSize: userOrders.length, total: userOrders.length, totalPages: 1 },
    });
  }

  // Admin: fetch all orders
  return NextResponse.json({
    success: true,
    data: MOCK_ORDERS_DB,
    pagination: {
      page: 1,
      pageSize: MOCK_ORDERS_DB.length,
      total: MOCK_ORDERS_DB.length,
      totalPages: 1,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { items, shippingAddress, billingAddress, subtotal, tax, shipping, discount, total, paymentIntentId, notes } = body as {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    subtotal: number;
    tax: number;
    shipping: number;
    discount?: number;
    total: number;
    paymentIntentId?: string;
    notes?: string;
  };

  if (!items?.length || !shippingAddress || !total) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const order: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    customerEmail: shippingAddress.email,
    items,
    shippingAddress,
    billingAddress,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    status: 'confirmed',
    paymentIntentId,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_ORDERS_DB.push(order);

  // In production: send confirmation email via Nodemailer
  // await sendOrderConfirmationEmail(order);

  return NextResponse.json({ success: true, data: order }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  // Admin: update order status
  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.status) {
    return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
  }

  const order = MOCK_ORDERS_DB.find(o => o.id === body.id);
  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  order.status = body.status;
  order.updatedAt = new Date().toISOString();
  if (body.trackingNumber) order.trackingNumber = body.trackingNumber;

  return NextResponse.json({ success: true, data: order });
}
