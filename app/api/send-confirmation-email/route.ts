import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateInvoiceHTML } from '@/lib/invoice-html';
import { generatePDFFromHTML } from '@/lib/pdf-generator';
import { Order } from '@/lib/supabase';

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
      // 支払い情報
      paymentMethod,
      paymentAmount,
      invoiceNumber,
      invoiceRecipientName,
      invoicePostalCode,
      invoiceAddress,
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

    // 銀行振込の場合の振込先情報
    const bankName = process.env.BANK_NAME || '（未設定）';
    const bankBranch = process.env.BANK_BRANCH || '（未設定）';
    const bankAccountType = process.env.BANK_ACCOUNT_TYPE || '普通';
    const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER || '（未設定）';
    const bankAccountHolder = process.env.BANK_ACCOUNT_HOLDER || '（未設定）';

    // 支払い期限（14日後）
    const dueDate = new Date(orderDate);
    dueDate.setDate(dueDate.getDate() + 14);
    const formattedDueDate = `${dueDate.getFullYear()}年${dueDate.getMonth() + 1}月${dueDate.getDate()}日`;

    // 支払い方法に応じたメール件名
    const emailSubject = paymentMethod === 'bank_transfer'
      ? '【ワンタップシール】ご注文ありがとうございます（お振込みのご案内）'
      : '【ワンタップシール】ご注文ありがとうございます';

    // 銀行振込用の追加セクション
    const bankTransferSection = paymentMethod === 'bank_transfer' ? `
            <div class="order-info" style="background-color: #e8f4f8; border: 2px solid #0288d1;">
              <h2 style="margin-top: 0; color: #0277bd;">お振込み情報</h2>
              <p style="color: #d32f2f; font-weight: bold; margin-bottom: 15px;">お支払い期限: ${formattedDueDate}</p>
              <div class="info-row">
                <div class="info-label">請求書番号:</div>
                <div class="info-value">${invoiceNumber || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">ご請求金額:</div>
                <div class="info-value" style="font-size: 18px; font-weight: bold; color: #d32f2f;">¥${(paymentAmount || 0).toLocaleString()}</div>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <p style="font-weight: bold; margin-bottom: 10px;">振込先口座</p>
                <div class="info-row">
                  <div class="info-label">銀行名:</div>
                  <div class="info-value">${bankName}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">支店名:</div>
                  <div class="info-value">${bankBranch}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">口座種別:</div>
                  <div class="info-value">${bankAccountType}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">口座番号:</div>
                  <div class="info-value">${bankAccountNumber}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">口座名義:</div>
                  <div class="info-value">${bankAccountHolder}</div>
                </div>
              </div>
              <p style="margin-top: 15px; font-size: 12px; color: #666;">
                ※ 振込手数料はお客様のご負担となります。<br>
                ※ ご入金確認後、商品の発送準備を開始いたします。
              </p>
            </div>
    ` : '';

    // 銀行振込の場合のメッセージ
    const paymentMessage = paymentMethod === 'bank_transfer'
      ? '<p>上記の口座へお振込みをお願いいたします。ご入金確認後、製作を開始いたします。</p><p><strong>請求書PDFを添付しております。</strong>ご確認ください。</p>'
      : '<p>ご注文内容の製作を開始いたします。発送準備が整い次第、追跡番号とともにメールにてご連絡いたします。</p>';

    // 銀行振込の場合、請求書PDFを生成
    let invoicePdfBuffer: Buffer | null = null;
    if (paymentMethod === 'bank_transfer' && invoiceNumber) {
      try {
        // 注文オブジェクトを構築
        const orderForInvoice: Partial<Order> = {
          invoice_number: invoiceNumber,
          invoice_recipient_name: invoiceRecipientName || customerName,
          invoice_postal_code: invoicePostalCode || customerPostalCode,
          invoice_address: invoiceAddress || customerAddress,
          customer_name: customerName,
          customer_company_name: customerCompanyName,
          customer_postal_code: customerPostalCode,
          customer_address: customerAddress,
          quantity: quantity,
          created_at: orderDate,
        };

        const invoiceHtml = generateInvoiceHTML(orderForInvoice as Order);
        invoicePdfBuffer = await generatePDFFromHTML(invoiceHtml);
        console.log('Invoice PDF generated successfully');
      } catch (pdfError) {
        console.error('Error generating invoice PDF:', pdfError);
        // PDFの生成に失敗しても、メールは送信する
      }
    }

    // 顧客向けメール送信
    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: process.env.RESEND_FROM_EMAIL || 'noreply@1tapseal.com',
      to: customerEmail,
      subject: emailSubject,
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

            ${bankTransferSection}

            ${paymentMessage}

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
    };

    // PDFが生成できた場合は添付
    if (invoicePdfBuffer) {
      emailOptions.attachments = [
        {
          filename: `請求書_${invoiceNumber}.pdf`,
          content: invoicePdfBuffer,
        },
      ];
    }

    const { error: customerError } = await resend.emails.send(emailOptions);

    if (customerError) {
      console.error('Customer email error:', customerError);
    }

    // 管理者向けメール件名
    const adminSubject = paymentMethod === 'bank_transfer'
      ? `【新規注文・銀行振込】${customerName}様 - ${quantity}枚 - ¥${(paymentAmount || 0).toLocaleString()}`
      : `【新規注文・カード決済】${customerName}様 - ${quantity}枚`;

    // 管理者向けメール送信
    const { error: adminError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@1tapseal.com',
      to: ADMIN_EMAIL,
      subject: adminSubject,
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
              <div class="info-row">
                <div class="info-label">支払い方法:</div>
                <div class="info-value"><strong>${paymentMethod === 'bank_transfer' ? '銀行振込' : 'カード決済'}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">金額:</div>
                <div class="info-value"><strong style="color: #d32f2f;">¥${(paymentAmount || 0).toLocaleString()}</strong></div>
              </div>
              ${paymentMethod === 'bank_transfer' && invoiceNumber ? `
              <div class="info-row">
                <div class="info-label">請求書番号:</div>
                <div class="info-value">${invoiceNumber}</div>
              </div>
              <div class="info-row">
                <div class="info-label">支払い期限:</div>
                <div class="info-value" style="color: #d32f2f;">${formattedDueDate}</div>
              </div>
              ` : ''}
            </div>

            ${paymentMethod === 'bank_transfer' ? `
            <div class="section" style="background-color: #e8f4f8;">
              <h3 class="section-title" style="border-bottom-color: #0288d1; color: #0277bd;">請求書送付先</h3>
              <div class="info-row">
                <div class="info-label">宛名:</div>
                <div class="info-value">${invoiceRecipientName || customerName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">郵便番号:</div>
                <div class="info-value">〒${invoicePostalCode || customerPostalCode}</div>
              </div>
              <div class="info-row">
                <div class="info-label">住所:</div>
                <div class="info-value">${invoiceAddress || customerAddress}</div>
              </div>
            </div>
            ` : ''}

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
