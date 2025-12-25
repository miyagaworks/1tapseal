import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerEmail, customerName, quantity, orderDate } = body;

    // バリデーション
    if (!orderId || !customerEmail || !customerName || !quantity || !orderDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // メール送信
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@1tapseal.com',
      to: customerEmail,
      subject: '【ワンタップシール】ご注文ありがとうございます',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #ffdb47;
              color: #2e1a15;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #fffbf0;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .order-info {
              background-color: white;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .info-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              min-width: 120px;
              color: #6b7280;
            }
            .info-value {
              color: #111827;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">ワンタップシール</h1>
          </div>
          <div class="content">
            <p>${customerName} 様</p>
            <p>この度はワンタップシールをご注文いただき、誠にありがとうございます。</p>
            <p>ご注文を受け付けましたので、下記の内容をご確認ください。</p>

            <div class="order-info">
              <h2 style="margin-top: 0; color: #ff6f4d;">ご注文内容</h2>
              <div class="info-row">
                <div class="info-label">注文番号:</div>
                <div class="info-value">${orderId}</div>
              </div>
              <div class="info-row">
                <div class="info-label">注文日時:</div>
                <div class="info-value">${new Date(orderDate).toLocaleString('ja-JP')}</div>
              </div>
              <div class="info-row">
                <div class="info-label">注文枚数:</div>
                <div class="info-value">${quantity}枚</div>
              </div>
            </div>

            <p>ご注文内容の製作を開始いたします。発送準備が整い次第、追跡番号とともにメールにてご連絡いたします。</p>

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
          </div>
          <div class="footer">
            <p>このメールは送信専用です。返信いただいてもお答えできませんのでご了承ください。</p>
            <p>&copy; 2025 ワンタップシール by Senrigan Inc. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      id: data?.id
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
