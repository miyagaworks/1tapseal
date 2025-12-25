import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'order@1tapseal.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerEmail,
      customerName,
      customerCompanyName,
      customerPhone,
      customerPostalCode,
      customerPrefecture,
      customerCity,
      customerStreetAddress,
      customerBuilding,
      customerAddress,
      quantity,
      url,
      memo,
      orderDate,
    } = body;

    // バリデーション
    if (!orderId || !customerEmail || !customerName || !quantity || !orderDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const formattedDate = new Date(orderDate).toLocaleString('ja-JP');
    const fullAddress = `〒${customerPostalCode} ${customerPrefecture}${customerCity}${customerStreetAddress}${customerBuilding ? ` ${customerBuilding}` : ''}`;

    // 顧客向けメール送信
    const { error: customerError } = await resend.emails.send({
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
              min-width: 140px;
              color: #6b7280;
            }
            .info-value {
              color: #111827;
              word-break: break-all;
            }
            .url-box {
              background-color: #FEF3C7;
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              border: 2px solid #F59E0B;
            }
            .url-value {
              font-family: monospace;
              font-size: 14px;
              color: #D97706;
              word-break: break-all;
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
                <div class="info-value">${formattedDate}</div>
              </div>
              <div class="info-row">
                <div class="info-label">注文枚数:</div>
                <div class="info-value">${quantity}枚</div>
              </div>
            </div>

            <div class="url-box">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400E;">シールに書き込むURL</p>
              <div class="url-value">${url}</div>
            </div>

            <p>ご注文内容の製作を開始いたします。発送準備が整い次第、追跡番号とともにメールにてご連絡いたします。</p>

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 20px;">このメールは送信専用です。返信いただいてもお答えできませんのでご了承ください。</p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: left;">
              <p style="margin: 0; font-weight: bold; color: #333;">株式会社Senrigan</p>
              <p style="margin: 5px 0; font-style: italic; color: #666;">「千の想いを、ひとつのカタチに。」</p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                広島県広島市安佐南区山本2-3-35<br>
                E-mail: <a href="mailto:contact@1tapseal.com" style="color: #ff6f4d;">contact@1tapseal.com</a><br>
                WEB: <a href="https://1tapseal.com" style="color: #ff6f4d;">https://1tapseal.com</a>
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
    }

    // 管理者向けメール送信
    const { error: adminError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@1tapseal.com',
      to: ADMIN_EMAIL,
      subject: `【新規注文】${customerName}様 - ${quantity}枚`,
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
              max-width: 700px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #2563EB;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f8fafc;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .section {
              background-color: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .section-title {
              margin: 0 0 15px 0;
              padding-bottom: 10px;
              border-bottom: 2px solid #2563EB;
              color: #2563EB;
              font-size: 16px;
            }
            .info-row {
              display: flex;
              padding: 8px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              min-width: 140px;
              color: #64748b;
              font-size: 14px;
            }
            .info-value {
              color: #1e293b;
              font-size: 14px;
              word-break: break-all;
            }
            .highlight {
              background-color: #FEF3C7;
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              border-left: 4px solid #F59E0B;
            }
            .url-value {
              font-family: monospace;
              background-color: #f1f5f9;
              padding: 10px;
              border-radius: 4px;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">新規注文通知</h1>
          </div>
          <div class="content">
            <div class="section">
              <h3 class="section-title">注文情報</h3>
              <div class="info-row">
                <div class="info-label">注文番号:</div>
                <div class="info-value">${orderId}</div>
              </div>
              <div class="info-row">
                <div class="info-label">注文日時:</div>
                <div class="info-value">${formattedDate}</div>
              </div>
              <div class="info-row">
                <div class="info-label">注文枚数:</div>
                <div class="info-value"><strong>${quantity}枚</strong></div>
              </div>
            </div>

            <div class="highlight">
              <strong>書き込みURL:</strong>
              <div class="url-value">${url}</div>
            </div>

            ${memo ? `
            <div class="section">
              <h3 class="section-title">備考</h3>
              <p style="margin: 0; white-space: pre-wrap;">${memo}</p>
            </div>
            ` : ''}

            <div class="section">
              <h3 class="section-title">顧客情報</h3>
              ${customerCompanyName ? `
              <div class="info-row">
                <div class="info-label">会社名:</div>
                <div class="info-value">${customerCompanyName}</div>
              </div>
              ` : ''}
              <div class="info-row">
                <div class="info-label">お名前:</div>
                <div class="info-value">${customerName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">メール:</div>
                <div class="info-value">${customerEmail}</div>
              </div>
              <div class="info-row">
                <div class="info-label">電話番号:</div>
                <div class="info-value">${customerPhone}</div>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">配送先住所</h3>
              <div class="info-row">
                <div class="info-label">郵便番号:</div>
                <div class="info-value">〒${customerPostalCode}</div>
              </div>
              <div class="info-row">
                <div class="info-label">住所:</div>
                <div class="info-value">${customerPrefecture}${customerCity}${customerStreetAddress}${customerBuilding ? ` ${customerBuilding}` : ''}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (adminError) {
      console.error('Admin email error:', adminError);
    }

    if (customerError && adminError) {
      return NextResponse.json(
        { error: 'Failed to send emails' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully',
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
