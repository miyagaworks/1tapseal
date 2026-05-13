import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Vercel Cron 専用ルート
// vercel.json の crons 設定から定期的に呼び出される
// Supabase 無料プランの7日間アクセスなしによる一時停止を防ぐ

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Vercel Cron からのリクエストを検証
  // CRON_SECRET 未設定時は本番では拒否、開発では許可
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured' },
      { status: 500 }
    );
  }

  try {
    // 軽量な count クエリで Supabase をウォームアップ
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[keep-alive] Supabase query failed:', error);
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      count: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[keep-alive] Unexpected error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
