import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerEmail, customerName, quantity, trackingNumber } = body;

    // バリデーション
    if (!orderId || !customerEmail || !customerName || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // メール送信
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@1tapseal.com',
      to: customerEmail,
      subject: '【ワンタップシール】商品を発送いたしました',
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
              background-color: #10B981;
              color: white;
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
            .tracking-number {
              background-color: #FEF3C7;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
              border: 2px solid #F59E0B;
            }
            .tracking-number-value {
              font-size: 24px;
              font-weight: bold;
              color: #D97706;
              margin: 10px 0;
              letter-spacing: 2px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #10B981;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">ワンタップシール</h1>
          </div>
          <div class="content">
            <p>${customerName} 様</p>
            <p>ご注文いただいた商品を発送いたしました。</p>

            <div class="order-info">
              <h2 style="margin-top: 0; color: #10B981;">発送情報</h2>
              <div class="info-row">
                <div class="info-label">注文番号:</div>
                <div class="info-value">${orderId}</div>
              </div>
              ${quantity ? `
              <div class="info-row">
                <div class="info-label">注文枚数:</div>
                <div class="info-value">${quantity}枚</div>
              </div>
              ` : ''}
            </div>

            <div class="tracking-number">
              <p style="margin: 0; font-weight: bold; color: #92400E;">お問い合わせ番号</p>
              <div class="tracking-number-value">${trackingNumber}</div>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400E;">
                配送状況は配送業者のウェブサイトでご確認いただけます
              </p>
            </div>

            <p>商品到着まで今しばらくお待ちください。</p>
            <p>万が一、商品に不備がございましたら、お手数ですがお問い合わせください。</p>

            <p>この度はワンタップシールをご利用いただき、誠にありがとうございました。</p>
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
    console.error('Error sending shipping email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
