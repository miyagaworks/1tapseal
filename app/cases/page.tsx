import Link from "next/link";
import {
  MdMuseum, MdLocalHospital, MdHotel, MdRestaurant,
  MdEventNote, MdBusiness, MdSchool, MdStore,
  MdCheckCircle, MdTrendingUp, MdPeople, MdTimer, MdArrowBack, MdAssignment
} from "react-icons/md";

export default function CasesPage() {
  const cases = [
    {
      icon: <MdMuseum className="text-4xl text-accent-light" />,
      category: "美術館・博物館",
      title: "A美術館様",
      challenge: "展示物の解説をQRコードで提供していましたが、来館者がカメラを起動する手間を面倒に感じ、読み取り率が低い状態でした。",
      solution: "各展示物にワンタップシールを設置。スマートフォンをかざすだけで詳細解説ページにアクセスできるようにしました。",
      results: [
        "解説ページへのアクセス率が従来の2.5倍に向上",
        "来館者アンケートで「使いやすい」と高評価",
        "多言語対応ページへの誘導もスムーズに"
      ],
      stats: {
        improvement: "250%",
        usage: "月間12,000回",
        satisfaction: "92%"
      }
    },
    {
      icon: <MdLocalHospital className="text-4xl text-accent-light" />,
      category: "医療機関",
      title: "Bクリニック様",
      challenge: "待合室での問診票記入や予約システムの案内が紙ベースで、受付業務が煩雑になっていました。",
      solution: "受付カウンターと待合室にワンタップシールを設置。オンライン問診票と予約システムへの誘導を実現しました。",
      results: [
        "紙の問診票が90%削減され、受付業務が効率化",
        "待ち時間を利用した事前問診で診察時間を短縮",
        "Web予約の利用率が3倍に増加"
      ],
      stats: {
        improvement: "90%",
        usage: "月間800回",
        satisfaction: "88%"
      }
    },
    {
      icon: <MdHotel className="text-4xl text-accent-light" />,
      category: "ホテル・旅館",
      title: "Cホテル様",
      challenge: "客室内の設備案内や周辺観光情報を紙の冊子で提供していましたが、情報更新が大変でコストもかかっていました。",
      solution: "客室、ロビー、エレベーター内にワンタップシールを設置。施設案内や観光情報をデジタル化しました。",
      results: [
        "印刷コストを年間80万円削減",
        "リアルタイムでの情報更新が可能に",
        "外国人宿泊客向けの多言語対応を実現",
        "観光情報の閲覧率が大幅に向上"
      ],
      stats: {
        improvement: "80万円/年",
        usage: "月間2,500回",
        satisfaction: "95%"
      }
    },
    {
      icon: <MdRestaurant className="text-4xl text-accent-light" />,
      category: "飲食店",
      title: "Dレストラン様",
      challenge: "メニューのQRコード読み取りに時間がかかり、注文までの流れがスムーズではありませんでした。",
      solution: "各テーブルにワンタップシールを設置。メニュー閲覧とモバイルオーダーへの導線を改善しました。",
      results: [
        "メニュー閲覧から注文までの時間が40%短縮",
        "回転率が向上し、売上が15%アップ",
        "スタッフの負担軽減により接客品質が向上"
      ],
      stats: {
        improvement: "15%",
        usage: "月間4,200回",
        satisfaction: "90%"
      }
    },
    {
      icon: <MdEventNote className="text-4xl text-accent-light" />,
      category: "イベント",
      title: "E展示会様",
      challenge: "展示ブースでの資料配布が紙中心で、来場者情報の収集も効率的ではありませんでした。",
      solution: "各ブースにワンタップシールを設置。資料ダウンロードとアンケート回答をデジタル化しました。",
      results: [
        "紙資料のコストが70%削減",
        "アンケート回収率が4倍に向上",
        "来場者データの即座な集計・分析が可能に",
        "環境配慮の取り組みとしてPRポイントに"
      ],
      stats: {
        improvement: "400%",
        usage: "3日間で1,800回",
        satisfaction: "94%"
      }
    },
    {
      icon: <MdBusiness className="text-4xl text-accent-light" />,
      category: "オフィス",
      title: "F株式会社様",
      challenge: "来客対応でのWi-Fiパスワード共有や会議室案内が煩雑で、受付業務に時間がかかっていました。",
      solution: "受付と各会議室にワンタップシールを設置。Wi-Fi情報、会議室案内、社内マップへのアクセスを簡便化しました。",
      results: [
        "受付業務の時間が1件あたり3分短縮",
        "来客者の自律的な移動が可能に",
        "Wi-Fiパスワードの口頭伝達ミスがゼロに"
      ],
      stats: {
        improvement: "3分/件",
        usage: "月間600回",
        satisfaction: "87%"
      }
    },
    {
      icon: <MdSchool className="text-4xl text-accent-light" />,
      category: "教育機関",
      title: "G大学様",
      challenge: "キャンパス内の施設案内や学生向け情報提供が掲示板中心で、情報更新が遅れがちでした。",
      solution: "キャンパス内の各所にワンタップシールを設置。施設案内、時間割、イベント情報へのアクセスを提供しました。",
      results: [
        "学生の情報アクセス率が3倍に向上",
        "リアルタイムでの休講情報配信が可能に",
        "オープンキャンパスでの来場者案内も効率化"
      ],
      stats: {
        improvement: "300%",
        usage: "月間8,500回",
        satisfaction: "91%"
      }
    },
    {
      icon: <MdStore className="text-4xl text-accent-light" />,
      category: "小売店",
      title: "H雑貨店様",
      challenge: "商品の詳細情報や使用方法の説明が十分にできず、接客に時間がかかっていました。",
      solution: "商品棚にワンタップシールを設置。商品詳細ページ、使用動画、レビューへのアクセスを提供しました。",
      results: [
        "接客時間が1件あたり5分短縮",
        "顧客の購入前の情報収集が充実し、返品率が20%減少",
        "オンラインレビューの投稿数が増加"
      ],
      stats: {
        improvement: "20%減",
        usage: "月間3,200回",
        satisfaction: "89%"
      }
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
            <MdAssignment className="text-4xl md:text-5xl text-text-dark" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              導入事例
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* イントロ */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 border-l-4 border-primary">
              <p className="text-text-medium text-justify">
                ワンタップシールは、さまざまな業種・シーンで導入されています。
                ここでは、実際にワンタップシールを導入いただいたお客様の事例をご紹介します。
              </p>
            </div>
          </section>

          {/* 導入事例一覧 */}
          {cases.map((caseItem, idx) => (
            <section key={idx} className="mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-primary-light/30">
                {/* ヘッダー */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    {caseItem.icon}
                  </div>
                  <div>
                    <div className="inline-block bg-primary-light px-3 py-1 rounded-full text-sm font-semibold text-text-dark mb-2">
                      {caseItem.category}
                    </div>
                    <h2 className="text-2xl font-bold text-text-dark">
                      {caseItem.title}
                    </h2>
                  </div>
                </div>

                {/* 課題 */}
                <div className="mb-6">
                  <h3 className="font-bold text-text-dark mb-2 flex items-center gap-2">
                    <span className="bg-accent-light text-white px-3 py-1 rounded text-sm">課題</span>
                  </h3>
                  <p className="text-text-medium text-justify pl-2">
                    {caseItem.challenge}
                  </p>
                </div>

                {/* 解決策 */}
                <div className="mb-6">
                  <h3 className="font-bold text-text-dark mb-2 flex items-center gap-2">
                    <span className="bg-secondary text-white px-3 py-1 rounded text-sm">解決策</span>
                  </h3>
                  <p className="text-text-medium text-justify pl-2">
                    {caseItem.solution}
                  </p>
                </div>

                {/* 成果 */}
                <div className="mb-6">
                  <h3 className="font-bold text-text-dark mb-3 flex items-center gap-2">
                    <span className="bg-primary text-text-dark px-3 py-1 rounded text-sm">成果</span>
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {caseItem.results.map((result, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-text-medium">
                        <MdCheckCircle className="text-accent-light flex-shrink-0 mt-1" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-bg-cream to-primary-light/20 rounded-lg p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MdTrendingUp className="text-accent-light" />
                      <p className="text-sm text-text-medium font-semibold">改善効果</p>
                    </div>
                    <p className="text-2xl font-bold text-accent-light">{caseItem.stats.improvement}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MdTimer className="text-accent-light" />
                      <p className="text-sm text-text-medium font-semibold">利用実績</p>
                    </div>
                    <p className="text-2xl font-bold text-accent-light">{caseItem.stats.usage}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MdPeople className="text-accent-light" />
                      <p className="text-sm text-text-medium font-semibold">満足度</p>
                    </div>
                    <p className="text-2xl font-bold text-accent-light">{caseItem.stats.satisfaction}</p>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* CTA */}
          <section className="mt-12 mb-12">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-8 border-l-4 border-primary text-center">
              <h3 className="text-xl font-bold text-text-dark mb-4">
                あなたのビジネスでも、ワンタップシールを活用してみませんか？
              </h3>
              <p className="text-text-medium mb-6">
                導入のご相談や詳しい活用方法については、お気軽にお問い合わせください。
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link
                  href="/order"
                  className="inline-block bg-accent hover:bg-accent-light text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                >
                  ご注文はこちら
                </Link>
                <Link
                  href="/contact"
                  className="inline-block bg-secondary hover:bg-accent-light text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                >
                  お問い合わせ
                </Link>
              </div>
            </div>
          </section>

          {/* その他のページへのリンク */}
          <section>
            <div className="bg-bg-cream rounded-lg p-6">
              <h3 className="font-bold text-text-dark mb-4">その他のページ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/product"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">製品詳細 →</span>
                </Link>
                <Link
                  href="/faq"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">よくある質問 →</span>
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
