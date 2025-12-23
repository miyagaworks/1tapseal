import Link from "next/link";
import { MdHelpOutline, MdCheckCircle, MdInfo, MdArrowBack } from "react-icons/md";

export default function FAQPage() {
  const faqs = [
    {
      category: "製品について",
      icon: <MdInfo className="text-accent-light" />,
      questions: [
        {
          q: "ワンタップシールとは何ですか？",
          a: "ワンタップシールは、NFCタグが埋め込まれた透明なシールです。スマートフォンをかざすだけで、指定したURLに自動的にアクセスできます。QRコードと異なり、カメラを起動する必要がなく、より直感的な操作が可能です。"
        },
        {
          q: "どのようなスマートフォンで使えますか？",
          a: "NFC機能を搭載したスマートフォンで使用できます。iPhone（iPhone 7以降）とAndroid端末の多くが対応しています。特別なアプリのインストールは不要で、スマートフォンをかざすだけで動作します。"
        },
        {
          q: "透明なので目立たないのでは？",
          a: "透明であることが大きな特徴です。デザインを損なわずに貼り付けることができます。必要に応じて、「かざしてください」などの案内表示を併用することで、ユーザーに適切に誘導できます。また、色付きのシールを先に貼り、その上から透明なワンタップシールを重ねて貼ることで、お好みの色に変更することも可能です。"
        },
        {
          q: "屋外でも使用できますか？",
          a: "はい、防水仕様のため屋外でも使用できます。ただし、直射日光や極端な温度変化が続く環境では、粘着力が低下する可能性があります。"
        },
        {
          q: "一度貼ったら剥がせませんか？",
          a: "剥がすことは可能ですが、再利用はできません。貼り直しが必要な場合は、新しいシールをご使用ください。"
        }
      ]
    },
    {
      category: "注文について",
      icon: <MdCheckCircle className="text-accent-light" />,
      questions: [
        {
          q: "最小注文枚数はありますか？",
          a: "1枚から注文可能です。少量でお試しいただけますので、まずは数枚でお試しいただくことをおすすめします。"
        },
        {
          q: "大量注文の割引はありますか？",
          a: "はい、数量に応じた割引価格を設定しています。10枚以上で4%OFF、50枚以上で16%OFF、100枚以上で24%OFFとなります。詳しくは価格表をご確認ください。"
        },
        {
          q: "納期はどのくらいですか？",
          a: "通常、ご注文確定から3〜5営業日で発送いたします。大量注文の場合は、別途納期をご相談させていただきます。お急ぎの場合は、お問い合わせください。"
        },
        {
          q: "支払い方法は？",
          a: "銀行振込、クレジットカード決済に対応しています。詳しくはお問い合わせください。"
        },
        {
          q: "キャンセルはできますか？",
          a: "製造開始前であれば、キャンセルが可能です。製造開始後のキャンセルはお受けできませんので、ご了承ください。"
        }
      ]
    },
    {
      category: "技術仕様について",
      icon: <MdHelpOutline className="text-accent-light" />,
      questions: [
        {
          q: "書き込めるURLの長さに制限はありますか？",
          a: "使用しているNXP - NTAG213チップのメモリ容量（180バイト：45ページ × 4バイト）により、URL全体で約130文字程度まで記録できます。ご注文フォームでは、130文字を超えるURLを入力すると自動的に警告が表示され、ボタン1つで短縮URLに変換できる機能を提供しています。"
        },
        {
          q: "URLの書き換えはできますか？",
          a: "安全性の観点から、出荷時に書き込んだURLは変更できない仕様となっています。用途が変わる場合は、新しいシールをご注文ください。"
        },
        {
          q: "読み取り距離はどのくらいですか？",
          a: "スマートフォンをシールから1〜3cm程度の距離でかざすと読み取れます。スマートフォンの機種によって若干の差があります。"
        },
        {
          q: "電池は必要ですか？",
          a: "NFCタグは電池不要です。スマートフォンからの電波で動作するため、メンテナンスフリーで長期間使用できます。"
        },
        {
          q: "金属面に貼っても動作しますか？",
          a: "金属面に直接貼ると電波が遮断され、動作しません。金属製品への設置は避けてください。プラスチックや紙、木材など、非金属の素材に貼付することをおすすめします。"
        }
      ]
    },
    {
      category: "活用方法について",
      icon: <MdInfo className="text-accent-light" />,
      questions: [
        {
          q: "どのような用途で使われていますか？",
          a: "美術館や博物館での展示物の詳細情報案内、飲食店でのメニューや予約ページへの誘導、ホテルの観光情報案内、イベントでのアンケート収集、デジタル名刺での自己紹介ページ共有など、幅広い用途でご利用いただいています。"
        },
        {
          q: "QRコードと比べてどのようなメリットがありますか？",
          a: "QRコードはカメラを起動して読み取る必要がありますが、ワンタップシールはスマートフォンをかざすだけで瞬時にアクセスできます。また、透明なので貼付場所のデザインを損ないません。読み取り成功率も高く、ユーザーエクスペリエンスが向上します。"
        },
        {
          q: "複数のURLを1つのシールに書き込めますか？",
          a: "1つのシールには1つのURLのみ書き込めます。複数の情報を提供したい場合は、ランディングページを作成し、そこから各ページへリンクする方法をおすすめします。"
        },
        {
          q: "デザインシールと組み合わせて使えますか？",
          a: "はい、色付きや装飾シールを貼り、その上から透明なワンタップシールを貼ることで、デザイン性を持たせることができます。ワンタップシールの下に貼ることで、お好みの色やデザインにカスタマイズできます。"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-light to-primary py-6 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-text-dark hover:text-text-medium transition-all hover:gap-3 group">
            <MdArrowBack className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">トップページに戻る</span>
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <MdHelpOutline className="text-4xl md:text-5xl text-text-dark" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              よくある質問
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* イントロ */}
          <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 mb-12 border-l-4 border-primary">
            <p className="text-text-medium">
              ワンタップシールに関するよくある質問をまとめました。
              こちらに掲載されていないご質問は、お問い合わせページからお気軽にお問い合わせください。
            </p>
          </div>

          {/* FAQ セクション */}
          {faqs.map((category, idx) => (
            <section key={idx} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">{category.icon}</div>
                <h2 className="text-2xl font-bold text-text-dark">{category.category}</h2>
              </div>

              <div className="space-y-6">
                {category.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                    <h3 className="font-bold text-text-dark mb-3 flex items-start gap-2">
                      <MdHelpOutline className="text-accent-light flex-shrink-0 mt-1" />
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-text-medium pl-7 text-justify">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* お問い合わせへの誘導 */}
          <section className="mt-12">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-8 border-l-4 border-primary text-center">
              <h3 className="text-xl font-bold text-text-dark mb-4">
                その他のご質問はお問い合わせください
              </h3>
              <p className="text-text-medium mb-6">
                こちらに掲載されていないご質問や、より詳しい情報が必要な場合は、<br className="hidden md:inline"/>
                お気軽にお問い合わせください。
              </p>
              <Link
                href="/contact"
                className="inline-block bg-accent hover:bg-accent-light text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                お問い合わせページへ
              </Link>
            </div>
          </section>

          {/* その他のページへのリンク */}
          <section className="mt-12">
            <div className="bg-bg-cream rounded-lg p-6">
              <h3 className="font-bold text-text-dark mb-4">その他のページ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/order"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">ご注文ページ →</span>
                </Link>
                <Link
                  href="/product"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">製品詳細 →</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gradient-to-br from-text-medium via-text-medium to-text-dark text-bg-cream px-4 py-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 One Tap Seal by Senrigan Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
