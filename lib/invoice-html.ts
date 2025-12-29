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

  // 社印SVGを直接埋め込む（PDFで表示するため）
  const sealSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><path d="M90.53,1.88H9.46C5.28,1.88,1.88,5.28,1.88,9.46v81.07c0,4.18,3.4,7.59,7.59,7.59h81.07c4.18,0,7.59-3.4,7.59-7.59V9.46c0-4.18-3.4-7.59-7.59-7.59ZM96.77,90.53c0,3.44-2.8,6.23-6.23,6.23H9.46c-3.44,0-6.23-2.8-6.23-6.23V9.46c0-3.44,2.8-6.23,6.23-6.23h81.07c3.44,0,6.23,2.8,6.23,6.23v81.07Z" fill="#c73523"/><g><path d="M17.09,24.43c-.24,2.35-.37,4.76-.37,7.17,0,.8,0,2.68,1.11,2.68.96,0,.96-1.59.96-2.27v-.12c0-2.27.13-4.51.32-7.17.13-1.74.79-2.72,2.1-3.1v11.13c0,.77,0,2.59,1.06,2.59.92,0,1.04-1.38,1.04-2.59v-11.13c1.37.39,2.05,1.4,2.15,3.12.1,2.1.19,4.27.19,6.43v.76c0,.89,0,2.39.94,2.39,1.14,0,1.14-1.88,1.14-2.68,0-2.62-.09-4.96-.27-7.13-.25-3.12-1.64-4.9-4.15-5.28v-.73c.34,0,.68.02,1.03.04.51.02,1.01.04,1.52.04,1.21,0,1.82-.37,1.82-1.1,0-.95-1.29-1.36-4.31-1.36h-.06v-.44c3.26-.04,3.63-3.01,3.63-5.26v-.15c0-2.3-.31-3.23-1.06-3.23-.69,0-1.04.87-1.04,2.57l-.02.55c-.07,2.17-.17,2.99-1.52,3.12v-4.66c0-.77,0-2.59-1.04-2.59s-1.06,1.81-1.06,2.59v4.73c-1.34-.01-1.66-.52-1.66-2.6v-.85c0-1.46-.07-2.88-.97-2.88-.79,0-1.11,1.05-1.11,3.62v.15c0,2.28.41,4.9,3.65,4.9h.08v.43c-.07,0-.14,0-.22,0-2.25.02-4.26.14-4.26,1.35,0,.5.31,1.1,1.79,1.1.71,0,1.41-.03,2.12-.05l.58-.02v.72c-2.43.39-3.82,2.14-4.12,5.22Z" fill="#c73523"/><path d="M7.78,34.3c.83,0,.94-1.26.94-2.36,0-2.86.08-6.01.24-9.62.1-2.09.62-3.35,1.58-3.81v14.27c0,1.19.12,2.56,1.04,2.56,1.06,0,1.06-1.79,1.06-2.56v-14.25c1.13.62,1.46,2.36,1.54,3.81.11,2.45.22,5.35.22,8.24v.33c-.02.23-.02.53-.02.84,0,1.24.07,2.56.94,2.56,1.14,0,1.14-1.86,1.14-2.65,0-3.47-.09-6.6-.27-9.55-.21-3.78-1.4-5.81-3.54-6.06v-.39c.41-.02.75-.07,1.05-.15,2.01-.5,2.24-3.4,2.24-5.54,0-1.37-.12-2.94-1.09-2.94-.91,0-.95,1.29-1.02,3.07-.04,1.11-.09,2.48-.39,2.9-.19.24-.37.32-.74.32h-.06v-4.7c0-.78,0-2.59-1.06-2.59s-1.04,1.82-1.04,2.59v4.73h-.08c-.17,0-.34-.03-.45-.04-.69-.18-.69-2.05-.69-2.67v-.62c0-1.56-.12-3-1.01-3-.78,0-1.11,1-1.11,3.35v.12c0,2.48.26,5.12,3.34,5.2v.35c-2.17.21-3.38,2.23-3.59,6.03-.21,3.38-.32,6.59-.32,9.52v.12c0,.7,0,2.56,1.13,2.56Z" fill="#c73523"/><path d="M29.73,9.37c.83,0,1.67-.05,2.48-.1.8-.05,1.62-.1,2.42-.1h.9c1.58,0,2.69.06,3.37.17.95.2,2.17.93,2.57,2.04.04.12.15.41.16.51v1.07c-.46,0-.91,0-1.36-.01-.61,0-1.21-.01-1.82-.01-2.41,0-5.26.04-8.15.35,0,0-.11.01-.12.01-.57.07-2.09.27-2.09,1.37,0,.45.27.98,1.55.98.13,0,.25,0,.38-.01.11,0,.22-.01.37-.01,2.85-.25,5.41-.38,7.84-.38h3.43c.42,6.42,2.08,12.42,4.94,17.85l.07.13c.51.94,1.06,1.86,1.74,1.86.47,0,.79-.37.79-.89,0-.59-.34-1.34-.63-1.93-2.74-5.69-4.27-11.08-4.79-16.9.47.03.96.08,1.45.13.85.08,1.73.17,2.5.17,1.24,0,1.5-.53,1.5-.98,0-.68-.58-1.57-5.49-1.62v-1.16c0-.05.04-.28.17-.78.37-1.17.99-1.76,1.86-1.76h.28c.23.02.54.03.87.03.62,0,2.28,0,2.28-1.1,0-.92-1.03-1.24-1.99-1.24h-.29c-1.6,0-3.12,0-4.29,1.78-1.33-1.73-3.98-1.99-6.47-1.99h-1.25c-1.68,0-3.19.07-4.62.21-1.84.13-2.23.79-2.23,1.33,0,.46.29,1.01,1.65,1.01Z" fill="#c73523"/><path d="M29.66,31.37c.12,0,.25,0,.37-.02.11,0,.21-.01.36-.02,4.1-.4,6.68-.4,10.94,0,.1,0,.2,0,.3.01.12,0,.24.02.36.02,1.3,0,1.57-.55,1.57-1.01,0-.77-.78-1.25-2.18-1.36-1.38-.15-2.9-.22-4.62-.23v-6.06c.57.02,1.14.08,1.7.14.71.07,1.44.15,2.17.15,1.32,0,1.6-.56,1.6-1.04,0-1.1-1.78-1.57-5.94-1.57h-1.03c-4.13,0-5.89.47-5.89,1.57,0,.47.27,1.04,1.58,1.04.72,0,1.43-.08,2.13-.15.53-.06,1.08-.11,1.62-.14v6.06h-.11c-5.71,0-6.48.81-6.48,1.59,0,.46.27,1.01,1.57,1.01Z" fill="#c73523"/><path d="M57.95,15.65c1.98-.1,4.06-.1,6.04,0,1.01.05,2.05.1,3.09.1h.1c1.26,0,1.52-.53,1.52-.98,0-.54-.38-1.22-2.2-1.36-1.96-.16-3.91-.18-5.55-.18s-3.54.02-5.47.18c-1.84.13-2.23.81-2.23,1.36,0,.45.27.98,1.65.98,1.02,0,2.05-.05,3.05-.1Z" fill="#c73523"/><path d="M51.44,35.21c.72,0,1.09-.8,1.09-2.38,0-6.1.04-12.59.51-19.05.08-1.34.45-2.96,1.74-3.03.2,0,.47-.01.78-.02,2.1-.04,4.23-.13,5.35-.76.75.5,1.63.6,2.42.63l3.75.15c1.21.05,1.65,1.77,1.72,2.78.4,4.8.44,9.72.47,14.48.01,1.61.02,3.22.05,4.84v.14c.04.72.1,2.22,1.09,2.22s.99-1.65.99-2.27v-.12c0-7-.04-13.31-.49-19.67-.23-2.96-1.49-4.54-3.74-4.69-.4-.03-.89-.04-1.41-.06-1.11-.03-2.36-.06-3.19-.27-.43-.09-.54-.16-.55-.21-.03-.11-.04-.25-.05-.4-.05-.52-.14-1.49-1.02-1.49-.95,0-1.05.95-1.11,1.46-.02.15-.03.31-.07.47-.02.04-.12.1-.58.2-.77.21-1.99.23-3.06.26-.51.01-.99.02-1.39.05-2.34.15-3.58,1.78-3.79,4.99-.34,5.34-.49,11.07-.49,18.57v.73c0,.85,0,2.44.99,2.44Z" fill="#c73523"/><path d="M67.56,28.31c0-1.64-1.21-5.72-1.83-7.8.08,0,.17.01.25.02.48.03.96.07,1.52.07,1.3,0,1.57-.55,1.57-1.01,0-1.17-1.66-1.29-2.22-1.33-2-.18-3.99-.21-5.85-.21s-3.82.02-5.85.21c-.54.04-2.17.16-2.17,1.33,0,.38.2,1.01,1.65,1.01.46,0,.92-.03,1.38-.07.07,0,.14,0,.21-.01-.95,3.05-1.99,6.58-1.99,7.92,0,2.3,1.34,3.61,3.67,3.61h5.98c2.44,0,3.67-1.26,3.67-3.73ZM60.91,29.62c-.56,0-1.12.02-1.68.04-.55.02-1.1.04-1.64.04-.57,0-1.25-.21-1.25-1.22,0-1.3,1.48-5.6,2.43-8.14,1.45-.05,2.92-.05,4.41,0,.9,2.48,2.31,6.67,2.31,7.97,0,.98-.39,1.39-1.3,1.39-.55,0-1.09-.02-1.64-.04-.55-.02-1.09-.04-1.63-.04Z" fill="#c73523"/><path d="M72.53,32.3c0,.86.29,1.3.87,1.3,1.99,0,2.01-10.77,2.01-11.23,0-1.68-.07-3.35-.22-4.98l-.02-.18c-.08-.7-.24-2-1.21-2-.78,0-.87,1.18-.87,1.68,0,.25,0,.51.03.71.13,1.6.19,3.07.19,4.51,0,2.66-.2,5.45-.63,8.52-.07.53-.15,1.09-.15,1.67Z" fill="#c73523"/><path d="M74.06,13.88c.41,0,.82-.02,1.22-.04.39-.02.78-.04,1.18-.04v18.92c0,.74,0,2.47,1.04,2.47s1.06-1.8,1.06-2.47V13.79h.48c.34,0,.69.02,1.03.04.36.02.73.04,1.09.04,1.32,0,1.6-.55,1.6-1.01,0-1.02-1.37-1.48-4.45-1.48h-1.27c-3.16,0-4.58.46-4.58,1.48,0,.46.28,1.01,1.6,1.01Z" fill="#c73523"/><path d="M81.86,16.91c0-.51-.08-1.68-.87-1.68-.97,0-1.12,1.3-1.2,2l-.02.2c-.15,1.62-.22,3.3-.22,4.99,0,.46.02,11.23,2.04,11.23.58,0,.87-.44.87-1.3,0-.47-.07-.92-.13-1.36l-.05-.35c-.42-3.1-.63-5.89-.63-8.52,0-1.39.06-2.86.19-4.48.03-.22.03-.48.03-.73Z" fill="#c73523"/><path d="M74.4,9.39c.55,0,1.09-.03,1.64-.06,1.04-.06,2.08-.06,3.14,0,.55.03,1.09.06,1.64.06,1.46,0,1.77-.6,1.77-1.1,0-.93-1.23-1.33-4.11-1.33h-1.83c-1.96,0-3.97.16-3.97,1.39,0,.47.3,1.04,1.72,1.04Z" fill="#c73523"/><path d="M83.08,33.23c0,.46.28,1.01,1.6,1.01.61,0,1.22-.04,1.82-.09,1.15-.08,2.29-.09,3.44,0,.6.04,1.19.09,1.79.09,1.3,0,1.57-.55,1.57-1.01,0-1.4-2.6-1.46-3.98-1.47V11.99c1.19.18,1.76.85,1.83,2.13.15,3.45.17,6.93.17,10.18v4.54c0,1.64.34,2.44,1.04,2.44.88,0,.99-1.35.99-2.53v-5.51c0-3.7-.04-6.69-.12-9.42-.06-2.52-1.41-3.95-3.9-4.17v-.48c0-1.53-.13-2.94-1.04-2.94-.96,0-1.08,1.51-1.08,2.83,0,.22,0,.41.01.58-2.57.11-3.9,1.52-3.96,4.18-.12,4.93-.12,9.95-.12,14.81,0,1.31.12,2.65.99,2.65.71,0,1.06-.8,1.06-2.44,0-4.82,0-9.81.17-14.72.05-1.42.59-2.08,1.88-2.17v19.81c-2.17,0-4.15.2-4.15,1.47Z" fill="#c73523"/><path d="M12.44,63.97c2.66,0,4.54-1.33,5.58-3.95.43-1.11.67-2.37.67-3.55,0-2.79-1.13-4.98-3.28-6.35-.83-.53-1.73-1.07-2.68-1.41-1.6-.57-3.44-1.56-3.44-4.24s1.93-4.07,3.73-4.07c.99,0,1.9.33,2.61.94.52.46.92,1.08,1.09,1.66l.04.13c.28,1.02.59,1.94,1.26,1.94.47,0,.79-.44.79-1.1,0-.5-.13-.99-.25-1.41l-.05-.18c-.73-2.71-2.74-4.26-5.54-4.26s-5.67,1.98-5.67,6.34c0,1.44.36,2.69,1.1,3.83.91,1.4,2.33,2.03,3.7,2.64,1.59.71,3.09,1.37,3.99,3.17.4.8.61,1.66.61,2.5,0,3.61-2.08,5.23-4.15,5.23-1.46,0-3.37-.9-4.12-2.89l-.06-.17c-.22-.61-.52-1.46-1.19-1.46-.46,0-.79.42-.79.99,0,.52.18,1.07.33,1.52,0,0,.03.11.04.11,1.2,3.53,4.06,4.06,5.67,4.06Z" fill="#c73523"/><path d="M30.79,48.91c0-.47-.09-.85-.17-1.24-.82-3.12-1.96-6.01-4.78-6.01-3.73,0-6.05,4.65-6.05,12.15,0,6.8,2.17,11.02,5.67,11.02,1.92,0,4.34-1.65,5.44-5.34.1-.36.34-1.28.34-1.95,0-.72-.3-1.19-.75-1.19-.63,0-.99.85-1.39,1.93-.78,2.19-2.5,3.66-3.61,3.66-.99,0-1.87-.57-2.46-1.6-.4-.68-.93-1.71-1.01-2.99l8.03-6.66c.5-.43.76-1.03.76-1.78ZM21.89,53.81v-.32c0-5.65,1.51-9.03,4.03-9.03,1.14,0,1.94,1.14,2.72,3.93l-6.75,5.42Z" fill="#c73523"/><path d="M40.19,62.28v.31c0,1.24.06,2.36.83,2.36.82,0,1.01-1.25,1.07-3.55l.33-13.19v-.7c0-5.09-2.37-5.85-3.79-5.85-1.49,0-2.6.73-3.51,2.35.02-.37.03-.75.03-1.13,0-.78,0-2.08-.95-2.08-.63,0-.87.74-.97,3.11l-.94,17.1c-.02.51-.04,1.02-.04,1.53,0,.78,0,1.97.77,1.97s1.01-1.17,1.13-3.22l.58-10.46c.03-.69,1.2-3.75,1.58-4.52.74-1.49,1.32-1.77,2.21-1.77.51,0,2.06,0,2.06,3.2,0,2.4-.1,4.85-.19,7.22-.1,2.39-.19,4.87-.19,7.31Z" fill="#c73523"/><path d="M53.25,43.59c0-1.69-2.25-2.24-3.02-2.24-1.45,0-2.65.91-3.57,2.7.05-.94.09-1.89.09-2.83,0-1.08-.1-2.32-.91-2.32-.47,0-.97.36-1.05,3l-.88,19.58c-.02.4-.02.75-.02,1.15,0,1.1.06,2.08.77,2.08.82,0,1.06-1.23,1.15-3.07l.45-10.62c.82-2.93,2.13-6.82,4.14-6.82.23,0,.49.11.77.22.33.13.7.29,1.12.29.45,0,.97-.29.97-1.11Z" fill="#c73523"/><path d="M55.89,44.54c.77,0,1.4-.99,1.4-2.2,0-1.3-.59-2.24-1.4-2.24s-1.33.9-1.33,2.24.56,2.2,1.33,2.2Z" fill="#c73523"/><path d="M53.83,59.99c-.02.32-.04.68-.04,1,0,2.74,1.15,3.71,2.22,3.71.81,0,3.46-1.3,3.46-3.05,0-.7-.39-1.23-.91-1.23s-.95.39-1.37.77c-.37.33-.74.67-1.08.67-.22,0-.43-.37-.43-1.06,0-.07,0-.14,0-.2,0-.09.01-.17,0-.23l.72-11.09c.03-.51.07-1.02.07-1.53s0-1.54-.75-1.54c-.27,0-1.08,0-1.25,3.26l-.64,10.53Z" fill="#c73523"/><path d="M70.71,41.86c0-1.2-.57-1.33-.81-1.33-.46,0-.79.42-1.05,1.4-.93-1.23-1.98-1.52-2.77-1.52-3.01,0-4.87,3.94-4.87,7.59,0,2.73,1.24,5.64,3.52,5.64.7,0,1.38-.26,2.04-.78l-.29,1.66c-3.07.14-6.22,1.94-6.22,6.68,0,1.8.99,3.74,2.58,3.74,1.51,0,3.47-.87,4.02-3.32h0s.97-4.4.97-4.4c.19.02.38.03.58.03,1.19,0,1.44-.59,1.44-1.09,0-.83-.77-1.23-1.45-1.39l2.12-11.25c.09-.48.19-1.06.19-1.66ZM66.03,57.02l-.77,3.3c-.02.09-.19.46-.26.59-.57,1.12-1.25,1.66-2.15,1.7-.04-.02-.08-.05-.1-.06-.35-.26-.53-.71-.53-1.35,0-.47.09-1.1.22-1.56.52-1.74,1.68-2.62,3.47-2.62h.13ZM68.34,44.74l-.78,4.43c-1.12,1.28-2.05,1.9-2.85,1.9-1.02,0-1.55-1.49-1.55-2.95,0-2.48,1.28-5.26,3-5.26,1.12,0,1.83,1.12,2.18,1.88Z" fill="#c73523"/><path d="M74.19,64.55c1.27,0,2.53-.93,3.74-2.76.51,2.67,2.07,3,2.79,3,.77,0,1.26-.52,1.26-1.35,0-1.21-1.2-1.49-1.66-1.6-.07-.02-.67-.26-.67-3.18,0-.14,0-.65.01-.78,0,0,0,0,0-.01l1.75-13.29c.09-.66.17-1.37.17-2.04,0-1.31-.55-1.5-.87-1.5-.47,0-.78.38-1,1.29-.7-1.24-1.6-1.87-2.69-1.87-2.52,0-4.52,3.54-5.55,6.85-.73,2.4-1.1,5.3-1.1,8.64,0,4.16,1.01,8.61,3.84,8.61ZM72.27,55.21c0-5.41,1.92-11.44,4.67-11.44.94,0,1.67.78,2.17,2.31l-1.42,11.52c-1.73,3.27-2.84,3.96-3.46,3.96-1.23,0-1.96-3.23-1.96-6.35Z" fill="#c73523"/><path d="M89.8,41.66c-1.49,0-2.6.73-3.51,2.35.02-.37.03-.75.03-1.13,0-.78,0-2.08-.95-2.08-.63,0-.87.74-.97,3.11l-.94,17.1c-.02.51-.04,1.02-.04,1.53,0,.78,0,1.97.77,1.97s1.01-1.17,1.13-3.22l.58-10.46c.03-.69,1.2-3.75,1.58-4.52.73-1.49,1.32-1.77,2.21-1.77.51,0,2.06,0,2.06,3.2,0,2.4-.1,4.85-.19,7.22-.1,2.39-.19,4.87-.19,7.31v.31c0,1.24.06,2.36.83,2.36.82,0,1.01-1.25,1.07-3.55l.33-13.19v-.7c0-5.09-2.37-5.85-3.79-5.85Z" fill="#c73523"/></g><g><path d="M42.11,68.12c-2.66,0-5.49,1.57-5.49,4.49v11.25c0,.87,0,3.19-4.66,3.19h-2.96v-17.66c0-.7-.57-1.27-1.27-1.27s-1.27.57-1.27,1.27v17.66h-2.96c-3.1,0-4.67-1.07-4.67-3.19v-11.25c0-3.09-2.85-4.49-5.49-4.49s-5.49,1.41-5.49,4.49v19.48c0,.7.57,1.27,1.27,1.27s1.27-.57,1.27-1.27v-19.48c0-1.91,2.66-1.96,2.96-1.96s2.96.05,2.96,1.96v11.25c0,3.58,2.69,5.72,7.2,5.72h2.96v1.25h-10.05c-.7,0-1.27.57-1.27,1.27s.57,1.27,1.27,1.27h22.62c.7,0,1.27-.57,1.27-1.27s-.57-1.27-1.27-1.27h-10.04v-1.25h2.96c6.49,0,7.19-4,7.19-5.72v-11.25c0-1.6,2.19-1.96,2.96-1.96.7,0,2.96.14,2.96,1.96v19.48c0,.7.57,1.27,1.27,1.27s1.27-.57,1.27-1.27v-19.48c0-3.1-2.76-4.49-5.49-4.49Z" fill="#c73523"/><path d="M92.14,69.38c0-.7-.57-1.27-1.27-1.27h-28.98c-4.23,0-7,.46-8.61,2.83-1.01,1.49-.86,3.63-.26,5.1.33.81.85,1.56,1.45,2.23h-.81c-.7,0-1.27.57-1.27,1.27s.57,1.27,1.27,1.27h17.4v2.87h-12.36c-5.86,0-6.31,3.59-6.31,4.7,0,3.02,2.79,4.98,7.11,4.98,1.87,0,3.37-.41,5.11-.88,2.37-.64,5.32-1.44,10.54-1.44,8.72,0,15.24,2.22,15.3,2.24.14.05.28.07.41.07.52,0,1.01-.33,1.19-.85.23-.66-.12-1.38-.78-1.61-.28-.1-6.97-2.38-16.13-2.38-5.56,0-8.69.85-11.2,1.53-1.63.44-2.91.79-4.45.79-2.21,0-4.58-.64-4.58-2.45,0-1.44,1.27-2.17,3.78-2.17h27.77c4.18,0,5.66-2.18,5.66-4.05,0-1.17-.55-3.88-5.66-3.88h-16.33c-.06-.06-.1-.14-.17-.19-.65-.48-2.45-2.02-2.95-3.32-.5-1.32-.85-2.79-1-4.11h6.46c.22.65.56,1.57,1.04,2.52,1.31,2.61,4.32,3.94,8.96,3.94h8.39c.7,0,1.27-.57,1.27-1.27s-.57-1.27-1.27-1.27h-8.39c-3.6,0-5.85-.85-6.7-2.54-.24-.48-.44-.96-.61-1.38h15.69c.7,0,1.27-.57,1.27-1.27ZM89.61,82.16c0,.94-1.2,1.52-3.13,1.52h-12.88v-2.87h12.88c1.43,0,3.13.23,3.13,1.35ZM64.67,75.66c.36.96,1.06,1.86,1.76,2.61h-7.8c-.14-.15-.3-.29-.5-.36-1.07-.39-2.26-1.6-2.76-2.83-.39-.95-.38-2.14.01-2.72.74-1.09,2.05-1.72,6.52-1.72h1.6c.15,1.62.55,3.39,1.17,5.01Z" fill="#c73523"/></g></svg>`;

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>請求書 ${order.invoice_number}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
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
      display: flex;
      align-items: flex-start;
    }
    .info-label {
      color: #666;
      flex-shrink: 0;
      width: 80px;
    }
    .info-value {
      flex: 1;
      word-break: break-all;
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
        ${(() => {
          // 請求書情報から会社名と担当者名を取得（なければ顧客情報から）
          const invoiceCompanyName = order.invoice_company_name || order.customer_company_name || '';
          const invoiceContactName = order.invoice_contact_name || order.customer_name || '';

          let recipientHtml = '';
          if (invoiceCompanyName) {
            recipientHtml += `<div class="recipient-name">${invoiceCompanyName} 御中</div>`;
          }
          if (invoiceContactName) {
            recipientHtml += `<div class="recipient-name" style="font-size: 14px; margin-top: 5px;">${invoiceContactName} 様</div>`;
          }
          return recipientHtml || `<div class="recipient-name">${order.invoice_recipient_name || order.customer_name} 様</div>`;
        })()}
        <div class="info-row">
          <span class="info-label">郵便番号</span>
          <span class="info-value">〒${order.invoice_postal_code || order.customer_postal_code}</span>
        </div>
        <div class="info-row">
          <span class="info-label">住所</span>
          <span class="info-value">${order.invoice_address || order.customer_address}</span>
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
          <div style="margin-left: 15px; flex-shrink: 0;">${sealSvg}</div>
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
