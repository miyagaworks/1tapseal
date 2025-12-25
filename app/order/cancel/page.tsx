"use client";

import Link from "next/link";
import { MdClose, MdShoppingCart, MdHome } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/30 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdClose className="text-5xl text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-text-dark mb-4">
            お支払いがキャンセルされました
          </h1>

          <p className="text-text-medium mb-6">
            決済がキャンセルまたは中断されました。<br />
            ご注文はまだ確定していません。
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-text-medium">注文番号</p>
              <p className="font-mono text-lg text-text-dark">{orderId}</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-text-medium text-sm">
              もう一度お試しいただくか、<br />
              銀行振込をご利用ください。
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              <MdShoppingCart className="text-xl" />
              注文ページに戻る
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-text-dark font-bold py-3 px-8 rounded-full border-2 border-primary-light transition-colors"
            >
              <MdHome className="text-xl" />
              トップページ
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-medium">
            ご不明な点がございましたら、<br />
            <a href="mailto:contact@1tapseal.com" className="text-accent-light hover:underline">
              contact@1tapseal.com
            </a>
            までお問い合わせください。
          </p>
        </div>
      </div>

      <footer className="bg-gradient-to-br from-text-medium via-text-medium to-text-dark text-bg-cream px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 One Tap Seal by Senrigan Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-light/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light mx-auto"></div>
          <p className="mt-4 text-text-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
