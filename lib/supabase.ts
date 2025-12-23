import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed';

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
}
