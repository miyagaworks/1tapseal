import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// サーバーサイド用（Service Role Key使用）- RLSをバイパス
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

// 型定義
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed';
export type PaymentMethod = 'card' | 'bank_transfer';
export type PaymentStatus = 'unpaid' | 'paid' | 'pending';

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;

  // 注文情報
  quantity: number;
  url: string;
  memo?: string;
  excel_file_path?: string;

  // 顧客情報
  customer_company_name?: string;
  customer_name: string;
  customer_email: string;
  customer_postal_code: string;
  customer_prefecture: string;
  customer_city: string;
  customer_street_address: string;
  customer_building?: string;
  customer_address: string; // 後方互換性のため残す
  customer_phone: string;

  // 配送情報
  tracking_number?: string;
  shipped_at?: string;

  // 支払い情報
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  payment_amount?: number;
  payment_date?: string;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;

  // 請求書情報
  invoice_number?: string;
  invoice_company_name?: string;
  invoice_contact_name?: string;
  invoice_recipient_name?: string;
  invoice_postal_code?: string;
  invoice_address?: string;
  invoice_registration_number?: string; // 顧客のT番号（任意）
  invoice_pdf_path?: string;
}

export interface CreateOrderInput {
  quantity: number;
  url: string;
  memo?: string;
  excel_file_path?: string;
  customer_company_name?: string;
  customer_name: string;
  customer_email: string;
  customer_postal_code: string;
  customer_prefecture: string;
  customer_city: string;
  customer_street_address: string;
  customer_building?: string;
  customer_address: string; // 後方互換性のため残す
  customer_phone: string;

  // 支払い情報
  payment_method: PaymentMethod;
  payment_amount: number;

  // 請求書情報（銀行振込の場合）
  invoice_company_name?: string;
  invoice_contact_name?: string;
  invoice_recipient_name?: string; // 後方互換性のため残す
  invoice_postal_code?: string;
  invoice_address?: string;
  invoice_registration_number?: string;
}
