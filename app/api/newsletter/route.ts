import { NextRequest, NextResponse } from 'next/server';

// In-memory store (use DB in production)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
  }

  if (subscribers.has(email)) {
    return NextResponse.json({ success: false, error: 'Already subscribed' }, { status: 409 });
  }

  subscribers.add(email);

  // In production:
  // await prisma.newsletterSubscriber.create({ data: { email } });
  // await sendWelcomeEmail(email);

  return NextResponse.json({
    success: true,
    message: 'Successfully subscribed! Check your inbox for your 10% discount code.',
    couponCode: 'WELCOME10',
  });
}
