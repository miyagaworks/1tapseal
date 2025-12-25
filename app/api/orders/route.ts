import { NextRequest, NextResponse } from 'next/server';
import { supabase, CreateOrderInput } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderInput = await request.json();

    // バリデーション
    const requiredFields = [
      'quantity',
      'url',
      'customer_name',
      'customer_email',
      'customer_postal_code',
      'customer_prefecture',
      'customer_city',
      'customer_street_address',
      'customer_address',
      'customer_phone',
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof CreateOrderInput]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customer_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 数量のバリデーション
    if (body.quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // 請求書番号を生成（銀行振込の場合）
    let invoiceNumber: string | null = null;
    if (body.payment_method === 'bank_transfer') {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

      // 今日の注文数をカウントして連番を生成
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .like('invoice_number', `INV-${dateStr}-%`);

      const seq = ((count || 0) + 1).toString().padStart(4, '0');
      invoiceNumber = `INV-${dateStr}-${seq}`;
    }

    // データベースに保存
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          quantity: body.quantity,
          url: body.url,
          memo: body.memo || null,
          excel_file_path: body.excel_file_path || null,
          customer_company_name: body.customer_company_name || null,
          customer_name: body.customer_name,
          customer_email: body.customer_email,
          customer_postal_code: body.customer_postal_code,
          customer_prefecture: body.customer_prefecture,
          customer_city: body.customer_city,
          customer_street_address: body.customer_street_address,
          customer_building: body.customer_building || null,
          customer_address: body.customer_address,
          customer_phone: body.customer_phone,
          status: 'pending',
          // 支払い情報
          payment_method: body.payment_method || null,
          payment_amount: body.payment_amount || null,
          payment_status: body.payment_method === 'bank_transfer' ? 'pending' : 'unpaid',
          // 請求書情報（銀行振込の場合）
          invoice_number: invoiceNumber,
          invoice_recipient_name: body.invoice_recipient_name || null,
          invoice_postal_code: body.invoice_postal_code || null,
          invoice_address: body.invoice_address || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // 確認メール送信（銀行振込の場合のみ即時送信、カード決済はWebhook経由）
    if (data.payment_method === 'bank_transfer') {
      try {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-confirmation-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: data.id,
            customerEmail: data.customer_email,
            customerName: data.customer_name,
            customerCompanyName: data.customer_company_name,
            customerPhone: data.customer_phone,
            customerPostalCode: data.customer_postal_code,
            customerPrefecture: data.customer_prefecture,
            customerCity: data.customer_city,
            customerStreetAddress: data.customer_street_address,
            customerBuilding: data.customer_building,
            customerAddress: data.customer_address,
            quantity: data.quantity,
            url: data.url,
            memo: data.memo,
            orderDate: data.created_at,
            // 支払い情報
            paymentMethod: data.payment_method,
            paymentAmount: data.payment_amount,
            invoiceNumber: data.invoice_number,
            invoiceRecipientName: data.invoice_recipient_name,
            invoicePostalCode: data.invoice_postal_code,
            invoiceAddress: data.invoice_address,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email, but order was created');
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // メール送信失敗でも注文は成功とする
      }
    }

    return NextResponse.json(
      { message: 'Order created successfully', order: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
