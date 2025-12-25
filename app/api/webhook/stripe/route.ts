import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // イベントタイプごとに処理
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error('No orderId in session metadata');
        break;
      }

      // 注文を更新
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_date: new Date().toISOString(),
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update order:', error);
      } else {
        console.log(`Order ${orderId} payment completed`);

        // 注文情報を取得して確認メールを送信
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (order) {
          // 確認メール送信
          try {
            const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://1tapseal.com';
            await fetch(`${origin}/api/send-confirmation-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.id,
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                customerCompanyName: order.customer_company_name,
                customerPhone: order.customer_phone,
                customerPostalCode: order.customer_postal_code,
                customerPrefecture: order.customer_prefecture,
                customerCity: order.customer_city,
                customerStreetAddress: order.customer_street_address,
                customerBuilding: order.customer_building,
                customerAddress: order.customer_address,
                quantity: order.quantity,
                url: order.url,
                memo: order.memo,
                orderDate: order.created_at,
                paymentMethod: order.payment_method,
                paymentAmount: order.payment_amount,
              }),
            });
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // 期限切れの場合、注文をキャンセル扱いに
        await supabase
          .from('orders')
          .update({
            payment_status: 'unpaid',
            status: 'pending',
          })
          .eq('id', orderId);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
