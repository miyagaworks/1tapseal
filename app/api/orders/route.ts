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

    // 確認メール送信
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
          quantity: data.quantity,
          orderDate: data.created_at,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation email, but order was created');
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // メール送信失敗でも注文は成功とする
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
