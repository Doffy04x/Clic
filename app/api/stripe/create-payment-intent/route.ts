import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.amount) {
    return NextResponse.json({ success: false, error: 'Amount required' }, { status: 400 });
  }

  const { amount, currency = 'eur', metadata = {} } = body as {
    amount: number;
    currency?: string;
    metadata?: Record<string, string>;
  };

  if (amount < 50) {
    return NextResponse.json(
      { success: false, error: 'Minimum order amount is €0.50' },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        source: 'clic-optique-web',
        ...metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
