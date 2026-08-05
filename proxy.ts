import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

// 管理画面 / 管理API を HTTP Basic 認証で保護する。
//
// ファイル名は proxy.ts であること（middleware.ts は非推奨。両方置くとビルドが E900 で失敗する）
//   → node_modules/next/dist/lib/constants.js:279 (PROXY_FILENAME = 'proxy')
//   → node_modules/next/dist/build/index.js:594-604 (E900 / deprecation warning)
//
// Proxy は常に Node.js ランタイムで動作するため runtime の指定は禁止（指定すると E394）
//   → node_modules/next/dist/build/analysis/get-page-static-info.js:549-565
//
// 【重要】顧客導線と Stripe の窓口は絶対に matcher へ含めないこと。
// /api/orders, /api/webhook/stripe, /api/upload, /api/create-checkout-session
// などを保護対象にすると注文と決済が止まる。

const REALM = 'Admin Area';

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

// 長さの違いで分岐しないよう、SHA-256 で固定長にしてから定数時間比較する
function secretEquals(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a, 'utf8').digest();
  const hb = createHash('sha256').update(b, 'utf8').digest();
  return timingSafeEqual(ha, hb);
}

export function proxy(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // ADMIN_PASSWORD 未設定時は本番では拒否、開発では許可
  // （app/api/cron/keep-alive/route.ts の CRON_SECRET と同じ方針）
  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('ADMIN_PASSWORD is not configured', {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = Buffer.from(authHeader.slice('Basic '.length).trim(), 'base64').toString('utf8');
  } catch {
    return unauthorized();
  }

  // "ユーザー名:パスワード" 形式。ユーザー名は任意、パスワードのみ照合する
  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorized();
  }

  if (!secretEquals(decoded.slice(separatorIndex + 1), adminPassword)) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
