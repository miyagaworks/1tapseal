import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約 | ワンタップシール',
  description: 'ワンタップシールの利用規約です。',
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-text-dark mb-8">利用規約</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">1. はじめに</h2>
            <p className="text-text-medium leading-relaxed">
              この利用規約（以下「本規約」）は、株式会社Senrigan（以下「当社」）が提供するサービス「ワンタップシール」（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただく際には、本規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">2. 定義</h2>
            <p className="text-text-medium leading-relaxed">
              本規約において使用する用語の定義は、次の各号に定めるとおりとします。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>「ユーザー」とは、本サービスを利用する全ての者を指します。</li>
              <li>「商品」とは、当社が販売するNFCシール（ワンタップシール）を指します。</li>
              <li>「注文」とは、ユーザーが本サービスを通じて商品を購入する行為を指します。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">3. 本規約の適用と変更</h2>
            <p className="text-text-medium leading-relaxed">
              本規約は、本サービスの提供条件及びユーザーと当社との間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。変更後の本規約は、当社が別途定める場合を除いて、本サービス上に表示された時点より効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">4. 注文と契約の成立</h2>
            <p className="text-text-medium leading-relaxed">
              ユーザーが本サービスを通じて商品を注文し、当社がこれを承諾した時点で売買契約が成立するものとします。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              当社は、以下の場合には注文を承諾しないことがあります。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>注文内容に虚偽、誤記または記載漏れがあった場合</li>
              <li>過去に本規約に違反したことがある方からの注文である場合</li>
              <li>その他、当社が注文を承諾することが適当でないと判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">5. 料金および支払方法</h2>
            <p className="text-text-medium leading-relaxed">
              商品の価格は、本サービスの注文ページに表示されるとおりとします。価格には消費税が含まれています。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              料金の支払いは、クレジットカード決済または銀行振込に対応しています。銀行振込の場合、振込手数料はお客様のご負担となります。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              銀行振込の場合、注文確定後14日以内にお振込みをお願いいたします。期限内にお振込みが確認できない場合、注文をキャンセルさせていただく場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">6. 配送</h2>
            <p className="text-text-medium leading-relaxed">
              商品は、ユーザーが指定した配送先住所に配送いたします。配送料は注文ページに表示されるとおりとします。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              商品の配送は、入金確認後、通常5〜7営業日以内に発送いたします。ただし、注文状況や在庫状況により、発送が遅れる場合があります。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              配送先住所の誤りや不在等によりお届けできなかった場合の再配送費用は、お客様のご負担となります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">7. 返品・交換</h2>
            <p className="text-text-medium leading-relaxed">
              商品はお客様のご注文内容に基づいて製作するオーダーメイド商品のため、お客様都合による返品・交換はお受けできません。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              ただし、以下の場合は交換または返金対応いたします。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>商品に製造上の欠陥がある場合</li>
              <li>配送中の破損がある場合</li>
              <li>注文内容と異なる商品が届いた場合</li>
            </ul>
            <p className="mt-2 text-text-medium leading-relaxed">
              上記の場合は、商品到着後7日以内に当社までご連絡ください。
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-text-dark mb-2">【重要】NFCシールの取り扱いについて</p>
              <p className="text-text-medium leading-relaxed">
                NFCシールは精密な電子部品を内蔵しているため、以下の場合は正常に動作しなくなります。これらの原因による故障は交換・返金の対象外となりますので、ご注意ください。
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
                <li>シールを曲げたり折り曲げた場合</li>
                <li>シールを一度貼った後に剥がして貼り直した場合</li>
                <li>過度な力や衝撃を加えた場合</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">8. 禁止事項</h2>
            <p className="text-text-medium leading-relaxed">
              ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-medium">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社または第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為</li>
              <li>虚偽の情報を登録する行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>不正な目的を持って本サービスを利用する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">9. 知的財産権</h2>
            <p className="text-text-medium leading-relaxed">
              本サービスおよび本サービスに関連する一切の情報についての著作権およびその他の知的財産権はすべて当社または当社にその利用を許諾した権利者に帰属します。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              ユーザーは、商品に設定するURLの内容について、自ら権利を有するか、必要な権利者の許諾を得たものであることを保証するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">10. 個人情報の取り扱い</h2>
            <p className="text-text-medium leading-relaxed">
              本サービスの利用によって取得する個人情報については、当社の「<Link href="/legal/privacy" className="text-accent-light hover:underline">プライバシーポリシー</Link>」に従い適切に取り扱うものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">11. 免責事項</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              当社は、商品の使用によりユーザーに生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              NFCシールの読み取りは、スマートフォンの機種や設定、環境により異なる場合があります。すべての端末での動作を保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">12. サービス内容の変更等</h2>
            <p className="text-text-medium leading-relaxed">
              当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-dark mb-3">13. 準拠法・裁判管轄</h2>
            <p className="text-text-medium leading-relaxed">
              本規約の解釈にあたっては、日本法を準拠法とします。
            </p>
            <p className="mt-2 text-text-medium leading-relaxed">
              本サービスに関して紛争が生じた場合には、広島地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
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
