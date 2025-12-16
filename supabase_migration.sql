-- 住所を分割するための新しいカラムを追加
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_company_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_prefecture TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_street_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_building TEXT;

-- 既存のcustomer_addressカラムは後方互換性のために残す

-- Excelファイルパスを保存するカラムを追加
ALTER TABLE orders ADD COLUMN IF NOT EXISTS excel_file_path TEXT;

-- Row Level Security (RLS) を有効化
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- サービスロール（バックエンド）用のポリシー：全操作を許可
CREATE POLICY "Service role has full access to orders"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 匿名ユーザー用のポリシー：INSERTのみ許可（注文作成用）
CREATE POLICY "Anonymous users can create orders"
ON orders
FOR INSERT
TO anon
WITH CHECK (true);

-- 認証済みユーザー用のポリシー（将来の管理画面用）
CREATE POLICY "Authenticated users can view all orders"
ON orders
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
ON orders
FOR DELETE
TO authenticated
USING (true);

-- update_updated_at_column関数のsearch_pathを修正（セキュリティ対策）
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
