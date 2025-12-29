import { NextRequest, NextResponse } from 'next/server';
import { supabase, Order } from '@/lib/supabase';
import { generateInvoiceHTML } from '@/lib/invoice-html';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

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

    // 銀行振込でない場合はエラー
    if (order.payment_method !== 'bank_transfer') {
      return NextResponse.json(
        { error: 'Invoice is only available for bank transfer orders' },
        { status: 400 }
      );
    }

    // HTMLを生成
    const html = generateInvoiceHTML(order as Order);

    // HTMLとして返す（ブラウザで印刷→PDFできる）
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

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

    // 銀行振込でない場合はエラー
    if (order.payment_method !== 'bank_transfer') {
      return NextResponse.json(
        { error: 'Invoice is only available for bank transfer orders' },
        { status: 400 }
      );
    }

    // HTMLを生成
    const html = generateInvoiceHTML(order as Order);

    return NextResponse.json({
      success: true,
      invoiceNumber: order.invoice_number,
      html: html,
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
