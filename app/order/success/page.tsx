"use client";

import Link from "next/link";
import { MdCheck, MdHome } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/30 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdCheck className="text-5xl text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-text-dark mb-4">
            お支払いが完了しました
          </h1>

          <p className="text-text-medium mb-6">
            ご注文ありがとうございます。<br />
            注文確認メールをお送りしましたので、ご確認ください。
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-text-medium">注文番号</p>
              <p className="font-mono text-lg text-text-dark">{orderId}</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-text-medium text-sm">
              商品の製作を開始いたします。<br />
              発送準備が整い次第、追跡番号とともにメールにてご連絡いたします。
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              <MdHome className="text-xl" />
              トップページに戻る
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-light/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light mx-auto"></div>
          <p className="mt-4 text-text-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
