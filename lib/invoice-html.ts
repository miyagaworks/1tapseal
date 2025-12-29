import { Order } from '@/lib/supabase';

// 請求書HTMLを生成
export function generateInvoiceHTML(order: Order): string {
  const now = new Date();
  const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 価格計算
  const quantity = order.quantity;
  let unitPrice = 550;
  if (quantity >= 10 && quantity < 50) {
    unitPrice = 528;
  } else if (quantity >= 50 && quantity < 100) {
    unitPrice = 462;
  }
  const subtotal = unitPrice * quantity;
  const shipping = 220;
  const total = subtotal + shipping;

  // 内税計算（10%）
  const taxRate = 0.1;
  const taxAmount = Math.floor(total * taxRate / (1 + taxRate));
  const preTaxAmount = total - taxAmount;

  // 環境変数から会社情報を取得
  const companyName = process.env.INVOICE_COMPANY_NAME || '株式会社Senrigan';
  const registrationNumber = process.env.INVOICE_REGISTRATION_NUMBER || 'T0000000000000';
  const companyAddress = process.env.INVOICE_ADDRESS || '広島県広島市安佐南区山本2-3-35';
  const companyPhone = process.env.INVOICE_PHONE || '';
  const companyEmail = process.env.INVOICE_EMAIL || 'contact@1tapseal.com';

  const bankName = process.env.BANK_NAME || '（未設定）';
  const bankBranch = process.env.BANK_BRANCH || '（未設定）';
  const bankAccountType = process.env.BANK_ACCOUNT_TYPE || '普通';
  const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER || '（未設定）';
  const bankAccountHolder = process.env.BANK_ACCOUNT_HOLDER || '（未設定）';

  // 社印画像をbase64で埋め込む（PDFで表示するため）
  const sealImageUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/images/syain.svg`
    : '/images/syain.svg';

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>請求書 ${order.invoice_number}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #333;
      padding-bottom: 20px;
    }
    .header h1 {
      font-size: 28px;
      letter-spacing: 8px;
      margin-bottom: 10px;
    }
    .invoice-number {
      font-size: 14px;
      color: #666;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .recipient, .issuer {
      width: 45%;
    }
    .recipient h2, .issuer h2 {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .recipient-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .info-row {
      margin-bottom: 5px;
    }
    .info-label {
      color: #666;
      display: inline-block;
      width: 80px;
    }
    .dates {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f8f8f8;
      border-radius: 4px;
    }
    .date-item {
      text-align: center;
    }
    .date-label {
      color: #666;
      font-size: 11px;
      margin-bottom: 5px;
    }
    .date-value {
      font-size: 14px;
      font-weight: bold;
    }
    .total-section {
      background: #fff3cd;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 30px;
      text-align: center;
    }
    .total-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    .total-amount {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
    .total-amount::before {
      content: '¥';
      font-size: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .subtotal-row td {
      background: #fafafa;
      font-weight: bold;
    }
    .bank-info {
      margin-top: 30px;
      padding: 20px;
      background: #e8f4f8;
      border-radius: 4px;
    }
    .bank-info h3 {
      font-size: 14px;
      margin-bottom: 15px;
      color: #333;
      border-bottom: 1px solid #ccc;
      padding-bottom: 8px;
    }
    .bank-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .bank-item {
      display: flex;
    }
    .bank-label {
      color: #666;
      width: 80px;
    }
    .notes {
      margin-top: 30px;
      padding: 15px;
      background: #fff8e1;
      border-radius: 4px;
      font-size: 11px;
      color: #666;
    }
    .notes h4 {
      font-size: 12px;
      color: #333;
      margin-bottom: 10px;
    }
    .notes ul {
      padding-left: 20px;
    }
    .notes li {
      margin-bottom: 5px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 10px;
    }
    .registration-number {
      font-size: 11px;
      color: #666;
      margin-top: 5px;
    }
    .issuer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .issuer-info {
      flex: 1;
    }
    .seal-image {
      width: 80px;
      height: 80px;
      margin-left: 15px;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>請 求 書</h1>
      <div class="invoice-number">No. ${order.invoice_number}</div>
    </div>

    <div class="parties">
      <div class="recipient">
        <h2>請求先</h2>
        <div class="recipient-name">${order.invoice_recipient_name || order.customer_name}${order.customer_company_name ? ' 御中' : ' 様'}</div>
        <div class="info-row">
          <span class="info-label">郵便番号</span>
          〒${order.invoice_postal_code || order.customer_postal_code}
        </div>
        <div class="info-row">
          <span class="info-label">住所</span>
          ${order.invoice_address || order.customer_address}
        </div>
      </div>

      <div class="issuer">
        <h2>発行者</h2>
        <div class="issuer-content">
          <div class="issuer-info">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${companyName}</div>
            <div class="registration-number">登録番号: ${registrationNumber}</div>
            <div class="info-row" style="margin-top: 10px;">
              ${companyAddress}
            </div>
            ${companyPhone ? `<div class="info-row">TEL: ${companyPhone}</div>` : ''}
            <div class="info-row">Email: ${companyEmail}</div>
          </div>
          <img src="${sealImageUrl}" alt="社印" class="seal-image" />
        </div>
      </div>
    </div>

    <div class="dates">
      <div class="date-item">
        <div class="date-label">請求日</div>
        <div class="date-value">${formatDate(now)}</div>
      </div>
      <div class="date-item">
        <div class="date-label">注文日</div>
        <div class="date-value">${formatDate(new Date(order.created_at))}</div>
      </div>
      <div class="date-item">
        <div class="date-label">お支払い期限</div>
        <div class="date-value" style="color: #d32f2f;">${formatDate(dueDate)}</div>
      </div>
    </div>

    <div class="total-section">
      <div class="total-label">ご請求金額（税込）</div>
      <div class="total-amount">${total.toLocaleString()}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>品名</th>
          <th class="text-center" style="width: 100px;">数量</th>
          <th class="text-right" style="width: 120px;">単価</th>
          <th class="text-right" style="width: 120px;">金額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ワンタップシール</td>
          <td class="text-center">${quantity}</td>
          <td class="text-right">¥${unitPrice.toLocaleString()}</td>
          <td class="text-right">¥${subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td>送料</td>
          <td class="text-center">1</td>
          <td class="text-right">¥${shipping.toLocaleString()}</td>
          <td class="text-right">¥${shipping.toLocaleString()}</td>
        </tr>
        <tr class="subtotal-row">
          <td colspan="3" class="text-right">小計（税抜）</td>
          <td class="text-right">¥${preTaxAmount.toLocaleString()}</td>
        </tr>
        <tr class="subtotal-row">
          <td colspan="3" class="text-right">消費税（10%）</td>
          <td class="text-right">¥${taxAmount.toLocaleString()}</td>
        </tr>
        <tr class="subtotal-row">
          <td colspan="3" class="text-right" style="font-size: 14px;">合計（税込）</td>
          <td class="text-right" style="font-size: 16px; font-weight: bold;">¥${total.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="bank-info">
      <h3>お振込先</h3>
      <div class="bank-details">
        <div class="bank-item">
          <span class="bank-label">銀行名</span>
          <span>${bankName}</span>
        </div>
        <div class="bank-item">
          <span class="bank-label">支店名</span>
          <span>${bankBranch}</span>
        </div>
        <div class="bank-item">
          <span class="bank-label">口座種別</span>
          <span>${bankAccountType}</span>
        </div>
        <div class="bank-item">
          <span class="bank-label">口座番号</span>
          <span>${bankAccountNumber}</span>
        </div>
        <div class="bank-item" style="grid-column: span 2;">
          <span class="bank-label">口座名義</span>
          <span>${bankAccountHolder}</span>
        </div>
      </div>
    </div>

    <div class="notes">
      <h4>備考</h4>
      <ul>
        <li>お振込み手数料は、お客様のご負担となりますことをご了承ください。</li>
        <li>お振込み確認後、商品の発送準備を開始いたします。</li>
        <li>ご不明な点がございましたら、${companyEmail} までお問い合わせください。</li>
      </ul>
    </div>

    <div class="footer">
      この請求書は適格請求書（インボイス）として発行されています。
    </div>
  </div>
</body>
</html>
`;
}
