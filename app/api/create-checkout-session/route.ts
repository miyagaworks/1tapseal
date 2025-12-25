import { NextRequest, NextResponse } from 'next/server';
import { getStripe, calculatePrice } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 注文を取得
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // カード決済でない場合はエラー
    if (order.payment_method !== 'card') {
      return NextResponse.json(
        { error: 'This order is not for card payment' },
        { status: 400 }
      );
    }

    // 価格計算
    const price = calculatePrice(order.quantity);

    // Stripe Checkout Session を作成
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'ワンタップシール',
              description: `${order.quantity}枚`,
            },
            unit_amount: price.unitPrice,
          },
          quantity: order.quantity,
        },
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: '送料',
            },
            unit_amount: price.shipping,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${request.nextUrl.origin}/order/cancel?order_id=${orderId}`,
      customer_email: order.customer_email,
      metadata: {
        orderId: orderId,
      },
    });

    // Checkout Session IDを注文に保存
    await supabase
      .from('orders')
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq('id', orderId);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
