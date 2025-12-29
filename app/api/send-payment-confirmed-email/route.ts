import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerEmail,
      customerName,
      quantity,
      paymentAmount,
    } = body;

    // バリデーション
    if (!orderId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 顧客向けメール送信
    const { error: customerError } = await resend.emails.send({
      from: `ワンタップシール <${process.env.RESEND_FROM_EMAIL || 'noreply@1tapseal.com'}>`,
      to: customerEmail,
      subject: '【ワンタップシール】ご入金を確認いたしました',
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
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f0fff4;
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
              min-width: 140px;
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
            <h1 style="margin: 0;">ご入金確認のお知らせ</h1>
          </div>
          <div class="content">
            <p>${customerName} 様</p>
            <p>この度はワンタップシールをご注文いただき、誠にありがとうございます。</p>
            <p>ご入金を確認いたしましたので、製作を開始いたします。</p>

            <div class="order-info">
              <h2 style="margin-top: 0; color: #4CAF50;">ご注文内容</h2>
              <div class="info-row">
                <div class="info-label">注文番号:</div>
                <div class="info-value">${orderId}</div>
              </div>
              <div class="info-row">
                <div class="info-label">注文枚数:</div>
                <div class="info-value">${quantity}枚</div>
              </div>
              <div class="info-row">
                <div class="info-label">お支払い金額:</div>
                <div class="info-value">¥${(paymentAmount || 0).toLocaleString()}</div>
              </div>
            </div>

            <p>発送準備が整い次第、追跡番号とともにメールにてご連絡いたします。</p>
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 20px;">このメールは送信専用です。返信いただいてもお答えできませんのでご了承ください。</p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: left;">
              <p style="margin: 0; font-weight: bold; color: #333;">株式会社Senrigan</p>
              <p style="margin: 5px 0; font-style: italic; color: #666;">「千の想いを、ひとつのカタチに。」</p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                広島県広島市安佐南区山本2-3-35<br>
                E-mail: <a href="mailto:contact@1tapseal.com" style="color: #4CAF50;">contact@1tapseal.com</a><br>
                WEB: <a href="https://1tapseal.com" style="color: #4CAF50;">https://1tapseal.com</a>
              </p>
            </div>
            <p style="margin-top: 20px;">&copy; 2025 ワンタップシール by Senrigan Inc. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (customerError) {
      console.error('Customer email error:', customerError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
