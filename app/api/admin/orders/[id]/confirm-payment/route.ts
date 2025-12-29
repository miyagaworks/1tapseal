import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// 入金確認処理
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseAdmin = getSupabaseAdmin();

    // 注文を取得
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // 銀行振込でない場合はエラー
    if (order.payment_method !== 'bank_transfer') {
      return NextResponse.json(
        { error: 'This order is not for bank transfer' },
        { status: 400 }
      );
    }

    // 既に入金済みの場合はエラー
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Payment already confirmed' },
        { status: 400 }
      );
    }

    // 入金確認処理
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_date: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('Failed to update payment status:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm payment' },
        { status: 500 }
      );
    }

    console.log('Payment confirmed for order:', id, 'New status:', updatedOrder.payment_status);

    // 入金確認メールを送信
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://1tapseal.com';
      await fetch(`${origin}/api/send-payment-confirmed-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          quantity: order.quantity,
          paymentAmount: order.payment_amount,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      // メール送信失敗でも入金確認は成功とする
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully',
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
