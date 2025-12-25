import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | ワンタップシール',
  description: 'ワンタップシールのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-cream">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-accent-light hover:text-accent font-bold">
            ← ホームに戻る
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text-dark mb-8">プライバシーポリシー</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">1. はじめに</h2>
            <p className="text-text-medium leading-relaxed">
              株式会社Senrigan（以下「当社」）は、提供するサービス「ワンタップシール」（以下「本サービス」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">2. 収集する情報</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、本サービスの提供にあたり、以下の情報を収集することがあります。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>氏名、会社名</li>
              <li>住所（配送先住所、請求書送付先住所）</li>
              <li>電話番号</li>
              <li>メールアドレス</li>
              <li>注文内容（商品、数量、URL情報等）</li>
              <li>決済情報（クレジットカード情報は決済代行会社が管理）</li>
              <li>利用履歴、アクセスログなどの利用情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">3. 利用目的</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、収集した情報を以下の目的で利用します。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>商品の製造・発送のため</li>
              <li>注文確認、発送通知等のご連絡のため</li>
              <li>請求書の発行・送付のため</li>
              <li>お問い合わせへの対応のため</li>
              <li>サービスの改善や新機能開発のため</li>
              <li>不正利用防止のため</li>
              <li>その他、本サービスの提供・運営に必要な目的のため</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">4. 情報の共有</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。ただし、以下の場合には、ユーザーの個人情報を第三者に提供することがあります。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>商品の配送のため、配送業者に配送先情報を提供する場合</li>
              <li>決済処理のため、決済代行会社に必要な情報を提供する場合</li>
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">5. 情報の保護</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、ユーザーの個人情報を適切に保護するため、セキュリティ対策を講じております。個人情報への不正アクセス、紛失、破壊、改ざん、漏洩などのリスクに対して、技術的及び組織的な安全対策を実施しています。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              クレジットカード情報は、当社のサーバーには保存されず、PCI DSS準拠の決済代行会社（Stripe）によって安全に管理されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">6. 情報の保存期間</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、利用目的の達成に必要な期間、個人情報を保存します。ただし、法令により保存が義務付けられている場合は、当該法令に定める期間保存します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">7. ユーザーの権利</h2>
            <p className="text-text-medium leading-relaxed">
              ユーザーは、当社に対して、自己の個人情報の開示、訂正、追加、削除、利用停止を請求することができます。請求を行う場合は、下記お問い合わせ先までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">8. Cookieの使用</h2>
            <p className="text-text-medium leading-relaxed">
              当社のサービスでは、ユーザー体験の向上やサービス改善のために、Cookieを使用することがあります。Cookieの使用を望まない場合は、ブラウザの設定でCookieを無効にすることができますが、一部の機能が利用できなくなる可能性があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">9. アクセス解析ツール</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、本サービスの利用状況を把握するため、Google Analyticsなどのアクセス解析ツールを使用することがあります。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">10. プライバシーポリシーの変更</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、本サービス上で通知いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">11. お問い合わせ</h2>
            <p className="text-text-medium leading-relaxed">
              本ポリシーに関するお問い合わせは、下記の連絡先までお願いいたします。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-text-dark">株式会社Senrigan</p>
              <p className="text-text-medium mt-2">
                住所: 広島県広島市安佐南区山本2-3-35
              </p>
              <p className="text-text-medium">
                メールアドレス: <a href="mailto:contact@1tapseal.com" className="text-accent-light hover:underline">contact@1tapseal.com</a>
              </p>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-right text-text-medium">
            <p>制定日: 2025年12月1日</p>
            <p className="mt-4 font-semibold">株式会社Senrigan</p>
          </div>
        </div>
      </main>

      <footer className="bg-text-dark text-bg-cream px-4 py-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">&copy; 2025 ワンタップシール by Senrigan Inc.</p>
        </div>
      </footer>
    </div>
  );
}
