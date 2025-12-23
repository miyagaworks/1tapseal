"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdMuseum,
  MdLocalHospital,
  MdHotel,
  MdLandscape,
  MdTrain,
  MdRestaurant,
  MdEventNote,
  MdBusiness,
  MdShoppingCart,
  MdDownload,
  MdDescription,
  MdClose,
  MdCheck,
  MdBarChart,
  MdTexture,
  MdLightMode,
  MdPalette,
  MdLayers,
  MdThumbDown,
  MdThumbUp
} from "react-icons/md";

export default function Home() {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // ページ読み込み後、少し遅延してアニメーション開始
    const animationTimer = setTimeout(() => {
      setAnimationStarted(true);
    }, 500);

    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* スマホ専用：マンガセクション */}
      <section className="md:hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* キャッチコピー */}
        <div className="text-center pt-6 pb-4 px-4">
          <p className="text-primary-light text-sm font-bold tracking-wider mb-1">
            LINE交換で差がつく
          </p>
          <h1 className="text-white text-2xl font-black">
            モテる男の新常識
          </h1>
        </div>

        {/* マンガ画像 */}
        <div className="px-2 pb-2">
          <Image
            src="/images/manga.jpg"
            alt="LINE交換で差がつく男 - ワンタップシール漫画"
            width={800}
            height={2400}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* トップキャッチコピー（黒背景） */}
      <section id="main-content" className="bg-gradient-to-br from-text-medium via-text-medium to-text-dark text-white px-4 pt-8 pb-4 md:py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-lg md:text-3xl lg:text-4xl font-bold leading-relaxed md:leading-tight">
            QRコードが読まれない、本当の理由。
            <br className="md:hidden" />
            それは「面倒だから」。
          </h1>
        </div>
      </section>

      {/* ヒーローセクション（黄色背景） */}
      <section className="bg-gradient-to-br from-primary-light via-primary-light to-primary text-text-dark px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* 大きな数字とテキスト */}
          <div className="mb-12 md:mb-16">
            <div className="grid grid-cols-[auto_auto] md:grid-cols-[auto_auto_1fr] gap-2 md:gap-2 items-end justify-center mx-auto max-w-fit">
              {/* 左側：0.3 */}
              <div className="text-left">
                <span
                  className="text-[126px] md:text-[200px] lg:text-[260px] font-black ml-2 text-text-dark leading-[0.85]"
                  style={{
                    fontFamily: "Impact, Arial Black, sans-serif",
                    transform: "skewX(-20deg)",
                    display: "inline-block",
                  }}
                >
                  0.3
                </span>
              </div>
              {/* 中央：読取速度と秒 */}
              <div className="text-left flex flex-col justify-between h-full -ml-4 md:-ml-8">
                <div
                  className="text-[36px] md:text-[60px] lg:text-[70px] font-black text-text-dark leading-none mb-auto ml-6 md:ml-16 md:mt-1"
                  style={{
                    fontFamily: "Impact, Arial Black, sans-serif",
                    fontWeight: "bold",
                    transform: "skewX(-20deg)",
                    display: "inline-block",
                  }}
                >
                  読取速度
                </div>
                <span
                  className="text-[56px] md:text-[110px] lg:text-[130px] font-black text-text-dark leading-[0.85] pb-3 md:ml-5"
                  style={{
                    fontFamily: "Impact, Arial Black, sans-serif",
                    transform: "skewX(-20deg)",
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  秒
                </span>
              </div>
              {/* 右側：テキスト */}
              <div className="text-base md:text-xl lg:text-2xl text-text-dark leading-snug border-l-[3px] md:border-l-[6px] border-text-dark pl-4 md:pl-6 pb-1 ml-3 md:-ml-24 col-span-2 md:col-span-1 mt-4 md:mt-0 mx-auto md:mx-0 max-w-fit md:max-w-none">
                <p className="mb-1 md:mb-2">
                  ワンタップシールなら、「かざすだけ」。
                </p>
                <p className="mb-1 md:mb-2">
                  透明だから、どんな空間にも馴染む。
                </p>
                <p>誰もが、迷わず使える。</p>
              </div>
            </div>
          </div>

          {/* メインビジュアル - NFCアニメーション */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-3xl aspect-square rounded-3xl overflow-hidden mx-4">
              {/* 背景画像 */}
              <Image
                src="/images/woodtable.png"
                alt="Wood Table"
                fill
                className="object-cover"
                priority
              />

              {/* nfc.png - 最背面、上部中央に固定 */}
              <div className="absolute top-8 md:top-[4.5rem] left-1/2 -translate-x-1/2 z-0 w-[30%]">
                <Image
                  src="/images/nfc.png"
                  alt="NFC Tag"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
              </div>

              {/* layer3.png - スマホ画面（下から上へ移動） */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 ease-out w-[85%]`}
                style={{
                  bottom: animationStarted ? "0" : "-100%",
                }}
              >
                <Image
                  src="/images/layer3.png"
                  alt="Phone Screen"
                  width={1600}
                  height={1400}
                  className="w-full h-auto"
                />
              </div>

              {/* layer2.png - ダイアログ（スライドダウン） */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-out w-[75%] ${
                  animationStarted
                    ? "top-[42%] opacity-100"
                    : "top-[15%] opacity-0"
                }`}
                style={{ transitionDelay: animationStarted ? "1000ms" : "0ms" }}
              >
                <Image
                  src="/images/layer2.png"
                  alt="Dialog"
                  width={1600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>

              {/* layer1.png - 外枠+ステータスバー（下から上へ移動、最前面） */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ease-out w-[85%]`}
                style={{
                  bottom: animationStarted ? "0" : "-100%",
                }}
              >
                <Image
                  src="/images/layer1.png"
                  alt="Phone Frame"
                  width={1600}
                  height={1400}
                  className="w-full h-auto"
                />
              </div>

              {/* piko.png - 吹き出し（ダイアログ停止後に表示、最前面） */}
              <div
                className={`absolute left-[65%] z-40 w-[20%] ${
                  animationStarted
                    ? "top-[20%] opacity-100 animate-piko"
                    : "top-[20%] opacity-0"
                }`}
                style={{
                  transitionDelay: animationStarted ? "1500ms" : "0ms",
                  animationDelay: animationStarted ? "1500ms" : "0ms",
                }}
              >
                <Image
                  src="/images/piko.png"
                  alt="Piko"
                  width={400}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#order"
              className="bg-accent-light hover:bg-accent text-white font-bold py-4 px-8 rounded-full text-center transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <MdShoppingCart className="text-2xl" />
              今すぐ注文（1枚500円〜）
            </Link>
            <Link
              href="#cases"
              className="bg-white/40 hover:bg-white/50 backdrop-blur text-text-dark font-bold py-4 px-8 rounded-full text-center transition-colors flex items-center justify-center gap-2"
            >
              <MdDescription className="text-2xl" />
              活用シーンを見る
            </Link>
          </div>
        </div>
      </section>

      {/* QRコードとの比較セクション */}
      <section className="px-4 py-16 md:py-24 bg-bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-text-dark mb-4">
              あなた自身もQRコードを読まないのでは？
            </h2>
            <p className="text-xl md:text-2xl text-text-medium italic">
              お客様も、同じです。
            </p>
          </div>

          {/* 比較表 - カード形式 */}
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 mb-8 items-center">
            {/* QRコード側 */}
            <div className="relative bg-white rounded-xl shadow-lg p-6 border-2 border-gray-300 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] opacity-5 pointer-events-none">
                <Image
                  src="/images/qr.svg"
                  alt=""
                  width={576}
                  height={576}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative z-10 flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-text-dark">
                  QRコード
                </h3>
                <MdThumbDown className="text-5xl text-red-400" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdClose className="text-red-500 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">
                        あなたの行動
                      </p>
                      <p className="text-text-medium text-sm">
                        「面倒だから読まない」
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdClose className="text-red-500 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">操作</p>
                      <p className="text-text-medium text-sm">
                        カメラ起動→枠に合わせる
                        <br />
                        <span className="font-bold">3〜5秒かかる</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdClose className="text-red-500 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">高齢者</p>
                      <p className="text-text-medium text-sm">
                        「わからない」→諦める
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdClose className="text-red-500 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">デザイン</p>
                      <p className="text-text-medium text-sm">
                        白黒の模様が目立つ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdBarChart className="text-red-600 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">
                        読み取り率
                      </p>
                      <p className="text-red-600 text-lg font-bold">
                        30〜50%（推定）
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VS バッジ（PC用・カードの間に配置） */}
            <div className="hidden md:flex justify-center">
              <Image
                src="/images/vs.svg"
                alt="VS"
                width={112}
                height={112}
                className="drop-shadow-xl"
              />
            </div>

            {/* モバイル用 VS */}
            <div className="md:hidden flex justify-center my-2 relative z-20">
              <Image
                src="/images/vs.svg"
                alt="VS"
                width={80}
                height={80}
                className="drop-shadow-xl"
              />
            </div>

            {/* ワンタップシール側 */}
            <div className="relative bg-gradient-to-br from-primary-light/20 to-primary/20 rounded-xl shadow-lg p-6 border-2 border-primary overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] opacity-5 pointer-events-none">
                <Image
                  src="/images/nfc.svg"
                  alt=""
                  width={576}
                  height={576}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative z-10 flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-text-dark">
                  ワンタップシール
                </h3>
                <MdThumbUp className="text-5xl text-accent-light" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdCheck className="text-accent-light text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">
                        あなたの行動
                      </p>
                      <p className="text-accent-light font-bold text-sm">
                        「かざすだけなら、やってみよう」
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdCheck className="text-accent-light text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">操作</p>
                      <p className="text-accent-light font-bold text-sm">
                        かざすだけ
                        <br />
                        <span className="text-lg">0.3秒で完了</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdCheck className="text-accent-light text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">高齢者</p>
                      <p className="text-accent-light font-bold text-sm">
                        「あら、簡単！」→全員使える
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdCheck className="text-accent-light text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">デザイン</p>
                      <p className="text-accent-light font-bold text-sm">
                        透明で馴染む、高級感
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white from-accent-light/20 to-accent/20 rounded-lg border-2 border-accent-light shadow-sm">
                  <div className="flex items-start gap-3">
                    <MdBarChart className="text-accent-light text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-dark mb-1">
                        読み取り率
                      </p>
                      <p className="text-accent-light text-lg font-bold">
                        80%以上（実証済み）
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg border-l-4 border-primary">
            <p className="text-lg md:text-xl text-justify text-text-dark italic text-center font-medium">
              「読まされる」QRコードから、「使いたくなる」ワンタップシールへ。
              <br />
              これは、認知の問題ではありません。
              <strong className="text-accent-light">体験の問題</strong>です。
            </p>
          </div>
        </div>
      </section>

      {/* 業種別セクション */}
      <section id="cases" className="px-4 py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-text-dark mb-4">
              活用シーン
            </h2>
            <p className="text-xl md:text-2xl text-text-medium italic">
              あらゆる場所で、情報をつなげる。
            </p>
          </div>

          {/* 美術館・博物館 */}
          <div className="mb-12 bg-gradient-to-br from-bg-cream to-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-primary-light">
            <div className="flex items-center gap-3 mb-4">
              <MdMuseum className="text-3xl text-accent-light" />
              <h3 className="text-xl md:text-2xl font-bold text-text-dark">
                美術館・博物館
              </h3>
            </div>

            <div className="mb-4">
              <Image
                src="/images/museum-usage.jpg"
                alt="美術館での使用イメージ"
                width={800}
                height={600}
                className="w-full h-auto rounded-xl"
              />
            </div>

            <h4 className="font-bold text-lg mb-2 text-text-dark">
              こんな課題ありませんか？
            </h4>
            <ul className="list-disc pl-5 text-text-medium mb-4 space-y-1">
              <li>
                展示解説をQRコードで提供しているが、高齢の来館者が読み取れない
              </li>
              <li>スタッフが何度も読み取り方を説明する手間</li>
              <li>多言語対応が難しい</li>
            </ul>

            <h4 className="font-bold text-lg mb-2 text-text-dark">
              ワンタップシールの解決策
            </h4>
            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">
                    かざすだけで解説表示
                  </strong>
                  ：高齢者でも迷わず使える
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">音声読み上げ対応</strong>
                  ：視覚障害者にも優しい
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">多言語対応</strong>
                  ：外国人観光客にも対応
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">
                    透明で展示を邪魔しない
                  </strong>
                  ：美術館の雰囲気を保つ
                </span>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 border-l-4 border-primary p-4 mb-4">
              <p className="text-sm text-text-dark">
                <strong>実証データ：</strong>
                小さな美術館の岡田さん「展示解説が読みやすかった」回答が
                <span className="text-accent-light font-bold">前年比2倍</span>に
              </p>
            </div>

            <Link
              href="#order"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-light to-primary hover:from-primary-dark hover:to-secondary text-text-dark font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              <MdDownload className="text-xl" />
              美術館向け導入ガイドをダウンロード（無料）
            </Link>
          </div>

          {/* 病院・クリニック */}
          <div className="mb-12 bg-gradient-to-br from-bg-cream to-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-primary-light">
            <div className="flex items-center gap-3 mb-4">
              <MdLocalHospital className="text-3xl text-accent-light" />
              <h3 className="text-xl md:text-2xl font-bold text-text-dark">
                病院・クリニック
              </h3>
            </div>

            <div className="mb-4">
              <Image
                src="/images/clinic-usage.jpg"
                alt="クリニックでの使用イメージ"
                width={800}
                height={600}
                className="w-full h-auto rounded-xl"
              />
            </div>

            <h4 className="font-bold text-lg mb-2 text-text-dark">
              こんな課題ありませんか？
            </h4>
            <ul className="list-disc pl-5 text-text-medium mb-4 space-y-1">
              <li>Web問診票を導入したが、高齢者が使えない</li>
              <li>受付で「どうやって読み取るの？」と毎回質問される</li>
              <li>結局、紙の問診票を併用している</li>
            </ul>

            <h4 className="font-bold text-lg mb-2 text-text-dark">
              ワンタップシールの解決策
            </h4>
            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">
                    かざすだけで問診票表示
                  </strong>
                  ：高齢者の入力率が大幅向上
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">受付業務の効率化</strong>
                  ：スタッフの説明負担が減る
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  <strong className="text-text-dark">待ち時間短縮</strong>
                  ：スムーズな受付で患者満足度向上
                </span>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 border-l-4 border-primary p-4 mb-4">
              <p className="text-sm text-text-dark">
                <strong>実証データ：</strong>
                小さなクリニックの山田さん「Web問診票の入力率が
                <span className="text-accent-light font-bold">30%→80%</span>
                に向上」
              </p>
            </div>

            <Link
              href="#order"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-light to-primary hover:from-primary-dark hover:to-secondary text-text-dark font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              <MdDownload className="text-xl" />
              病院向け導入ガイドをダウンロード（無料）
            </Link>
          </div>

          {/* その他の業種 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative bg-gradient-to-br from-white to-bg-cream rounded-lg shadow-lg border border-primary-light/30 overflow-hidden flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MdHotel className="text-2xl text-accent-light flex-shrink-0" />
                  <h4 className="font-bold text-lg text-text-dark">
                    ホテル・旅館
                  </h4>
                </div>
                <ul className="text-sm text-text-medium space-y-2">
                  <li>• 客室案内、Wi-Fi情報</li>
                  <li>• 館内案内</li>
                  <li>• 多言語対応</li>
                </ul>
              </div>
              <div className="w-2/5 relative">
                <Image
                  src="/images/hotel.jpg"
                  alt="ホテルでの使用イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white to-bg-cream rounded-lg shadow-lg border border-primary-light/30 overflow-hidden flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MdLandscape className="text-2xl text-accent-light flex-shrink-0" />
                  <h4 className="font-bold text-lg text-text-dark">観光地</h4>
                </div>
                <ul className="text-sm text-text-medium space-y-2">
                  <li>• 多言語音声ガイド</li>
                  <li>• 観光情報</li>
                  <li>• 24時間情報提供</li>
                </ul>
              </div>
              <div className="w-2/5 relative">
                <Image
                  src="/images/sightseeing.jpg"
                  alt="観光地での使用イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white to-bg-cream rounded-lg shadow-lg border border-primary-light/30 overflow-hidden flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MdTrain className="text-2xl text-accent-light flex-shrink-0" />
                  <h4 className="font-bold text-lg text-text-dark">
                    駅・公共施設
                  </h4>
                </div>
                <ul className="text-sm text-text-medium space-y-2">
                  <li>• バリアフリールート案内</li>
                  <li>• エレベーター位置</li>
                  <li>• 多言語対応</li>
                </ul>
              </div>
              <div className="w-2/5 relative">
                <Image
                  src="/images/facilities.jpg"
                  alt="駅・公共施設での使用イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white to-bg-cream rounded-lg shadow-lg border border-primary-light/30 overflow-hidden flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MdRestaurant className="text-2xl text-accent-light flex-shrink-0" />
                  <h4 className="font-bold text-lg text-text-dark">
                    飲食店・カフェ
                  </h4>
                </div>
                <ul className="text-sm text-text-medium space-y-2">
                  <li>• モバイルオーダー</li>
                  <li>• 会員登録</li>
                  <li>• メニュー表示</li>
                </ul>
              </div>
              <div className="w-2/5 relative">
                <Image
                  src="/images/cafe.jpg"
                  alt="飲食店・カフェでの使用イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white to-bg-cream rounded-lg shadow-lg border border-primary-light/30 overflow-hidden flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MdEventNote className="text-2xl text-accent-light flex-shrink-0" />
                  <h4 className="font-bold text-lg text-text-dark">
                    イベント会場
                  </h4>
                </div>
                <ul className="text-sm text-text-medium space-y-2">
                  <li>• 来場者登録</li>
                  <li>• ブース案内</li>
                  <li>• 限定コンテンツ</li>
                </ul>
              </div>
              <div className="w-2/5 relative">
                <Image
                  src="/images/event.jpg"
                  alt="イベント会場での使用イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white to-bg-cream rounded-lg shadow-lg border border-primary-light/30 overflow-hidden flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MdBusiness className="text-2xl text-accent-light flex-shrink-0" />
                  <h4 className="font-bold text-lg text-text-dark">オフィス</h4>
                </div>
                <ul className="text-sm text-text-medium space-y-2">
                  <li>• 会議室予約</li>
                  <li>• 複合機マニュアル</li>
                  <li>• 来客受付</li>
                </ul>
              </div>
              <div className="w-2/5 relative">
                <Image
                  src="/images/office.jpg"
                  alt="オフィスでの使用イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 透明シールの可能性 */}
      <section className="px-4 py-16 md:py-24 bg-bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-text-dark mb-4">
              透明だから、工夫次第で可能性は無限大
            </h2>
            <p className="text-xl md:text-2xl text-text-medium italic">
              デザインを活かしたまま、機能を追加。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {/* 画像: transparent-wood.jpg (600x400px) */}
                <p className="text-sm text-text-medium font-medium">
                  [画像: transparent-wood.jpg]
                  <br />
                  木目テーブルに貼ったシール
                  <br />
                  (600x400px)
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MdTexture className="text-2xl text-accent-light" />
                  <h4 className="font-bold text-lg text-text-dark">
                    高級素材に直接貼付
                  </h4>
                </div>
                <p className="text-text-medium">
                  木材・大理石・ガラスの質感を損なわない
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {/* 画像: transparent-glow.jpg (600x400px) */}
                <p className="text-sm text-text-medium font-medium">
                  [画像: transparent-glow.jpg]
                  <br />
                  夜光シールとの組み合わせ
                  <br />
                  (600x400px)
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MdLightMode className="text-2xl text-accent-light" />
                  <h4 className="font-bold text-lg text-text-dark">
                    夜光シールと組み合わせ
                  </h4>
                </div>
                <p className="text-text-medium">
                  暗いバー・クラブでも視認性確保
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {/* 画像: transparent-color.jpg (600x400px) */}
                <p className="text-sm text-text-medium font-medium">
                  [画像: transparent-color.jpg]
                  <br />
                  カラーシールとの組み合わせ
                  <br />
                  (600x400px)
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MdPalette className="text-2xl text-accent-light" />
                  <h4 className="font-bold text-lg text-text-dark">
                    カラーシールを下地に
                  </h4>
                </div>
                <p className="text-text-medium">ブランドカラーに合わせた演出</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {/* 画像: transparent-design.jpg (600x400px) */}
                <p className="text-sm text-text-medium font-medium">
                  [画像: transparent-design.jpg]
                  <br />
                  既存デザインの上に貼付
                  <br />
                  (600x400px)
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MdLayers className="text-2xl text-accent-light" />
                  <h4 className="font-bold text-lg text-text-dark">
                    既存デザインの上に
                  </h4>
                </div>
                <p className="text-text-medium">
                  ポスター・パッケージのデザインを活かす
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 価格セクション */}
      <section id="order" className="px-4 py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-text-dark mb-4">
              1枚500円から。まずは試してみてください。
            </h2>
            <p className="text-xl md:text-2xl text-text-medium italic">
              URL書き込み済み・送料込の価格。
            </p>
          </div>

          <div className="mb-8">
            <div className="overflow-hidden rounded-2xl shadow-lg border border-primary-light/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-light via-primary to-primary-dark">
                      <th className="px-2 py-3 md:px-6 md:py-5 text-center text-text-dark font-bold text-xs md:text-lg border-r border-primary-dark/20 whitespace-nowrap">
                        枚数
                      </th>
                      <th className="px-2 py-3 md:px-6 md:py-5 text-center text-text-dark font-bold text-xs md:text-base border-r border-primary-dark/20 whitespace-nowrap">
                        単価
                      </th>
                      <th className="px-2 py-3 md:px-6 md:py-5 text-center text-text-dark font-bold text-xs md:text-base border-r border-primary-dark/20 whitespace-nowrap">
                        小計
                      </th>
                      <th className="px-2 py-3 md:px-6 md:py-5 text-center text-text-dark font-bold text-xs md:text-base border-r border-primary-dark/20 whitespace-nowrap">
                        送料
                      </th>
                      <th className="px-2 py-3 md:px-6 md:py-5 text-center text-text-dark font-bold text-xs md:text-base">
                        <span className="block md:inline">合計</span>
                        <span className="block md:inline text-[10px] md:text-xs font-normal opacity-75 md:ml-1">
                          （税込）
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="hover:bg-primary-light/10 transition-colors border-b border-gray-200">
                      <td className="px-2 py-3 md:px-6 md:py-5 font-bold text-text-dark text-sm md:text-base text-center">
                        1枚
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        550<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        550<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        220<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center font-bold text-accent-light text-lg md:text-xl whitespace-nowrap">
                        770<span className="text-sm md:text-base">円</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary-light/10 transition-colors bg-gradient-to-r from-bg-cream/50 to-primary-light/5 border-b border-gray-200">
                      <td className="px-2 py-3 md:px-6 md:py-5 font-bold text-text-dark text-sm md:text-base text-center">
                        10枚
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        528<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        5,280<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        220<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center font-bold text-accent-light text-lg md:text-xl whitespace-nowrap">
                        5,500<span className="text-sm md:text-base">円</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary-light/10 transition-colors border-b border-gray-200">
                      <td className="px-2 py-3 md:px-6 md:py-5 font-bold text-text-dark text-sm md:text-base text-center">
                        50枚
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        462<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        23,100<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-xs md:text-base whitespace-nowrap">
                        220<span className="text-[10px] md:text-xs">円</span>
                      </td>
                      <td className="px-2 py-3 md:px-6 md:py-5 text-center font-bold text-accent-light text-lg md:text-xl whitespace-nowrap">
                        23,320<span className="text-sm md:text-base">円</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary-light/10 transition-colors bg-gradient-to-r from-primary-light/20 to-primary/10">
                      <td className="px-2 py-3 md:px-6 md:py-5 font-bold text-text-dark text-sm md:text-base text-center">
                        100枚
                        <br className="md:hidden" />
                        以上
                      </td>
                      <td
                        className="px-2 py-3 md:px-6 md:py-5 text-center text-text-medium text-base md:text-lg font-bold"
                        colSpan={4}
                      >
                        要見積
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 mb-8 border-l-4 border-primary">
            <h4 className="font-bold text-lg mb-3 text-text-dark">
              価格に含まれるもの
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  URL書き込み済みシール
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  書き換え防止ロック処理
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  動作確認
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-accent-light mr-2 text-xl">✓</span>
                <span className="text-text-medium text-justify flex-1">
                  全国一律送料（クリックポスト）
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-text-dark">
              <strong>納期：</strong>注文確定から3〜5営業日で発送
            </p>
          </div>

          <div className="text-center space-y-4">
            <Link
              href="/order"
              className="inline-flex items-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-4 px-12 rounded-full text-lg transition-colors shadow-lg"
            >
              <MdShoppingCart className="text-2xl" />
              今すぐ注文する
            </Link>
            <div>
              <Link
                href="/contact"
                className="inline-block text-accent-light hover:text-accent font-semibold underline"
              >
                大量注文の見積もり依頼
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section className="px-4 py-16 md:py-24 bg-bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-text-dark mb-4">
              お客様の声
            </h2>
            <p className="text-xl md:text-2xl text-text-medium italic">
              実際に使ってみた、お客様の感想。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                  {/* 画像: customer-okada.jpg (100x100px) */}
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-text-dark">岡田さん</h4>
                  <p className="text-sm text-text-medium">美術館館長</p>
                </div>
              </div>
              <blockquote className="text-text-medium italic border-l-4 border-primary pl-4 text-justify">
                「QRコードの時は、スタッフが何度も読み取り方を説明していました。でもワンタップシールなら、『かざすだけ』で理解してもらえます。投資額はたった21,000円でしたが、来館者の満足度が目に見えて向上しました」
              </blockquote>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-primary-light to-primary w-16 h-16 rounded-full flex items-center justify-center mr-4">
                  {/* 画像: customer-yamada.jpg (100x100px) */}
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-text-dark">山田さん</h4>
                  <p className="text-sm text-text-medium">クリニック院長</p>
                </div>
              </div>
              <blockquote className="text-text-medium italic border-l-4 border-primary pl-4 text-justify">
                「高齢の患者さんでも、『かざすだけ』なら理解できます。枠に合わせる、という一手間がないだけで、こんなに違うんですね。Web問診票の入力率が30%から80%に上がりました」
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary-light via-primary-light to-primary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-text-dark">
              小さな一歩が、大きな変化を生みます
            </h2>
            <p className="text-xl md:text-2xl text-text-medium italic">
              今すぐ、始めましょう。
            </p>
          </div>
          <p className="text-lg md:text-xl text-justify mb-8 leading-relaxed text-text-medium">
            それだけで、あなたの施設が変わります。
            <br />
            利用者が笑顔になります。
            <br />
            口コミが広がります。
            <br />
            <br />
            「誰もが使いやすい場所」という評判が、あなたの未来を作ります。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="bg-accent-light hover:bg-accent text-white font-bold py-4 px-12 rounded-full text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <MdShoppingCart className="text-2xl" />
              今すぐ注文を始める
            </Link>
            <Link
              href="/download"
              className="bg-white/40 hover:bg-white/50 backdrop-blur text-text-dark font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <MdDownload className="text-2xl" />
              まずは資料をダウンロード（無料）
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gradient-to-br from-text-medium via-text-medium to-text-dark text-bg-cream px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary-light">
                ワンタップシール
              </h3>
              <p className="text-sm text-bg-cream/90">
                「かざすだけ」でつながる世界を創る
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary-light">
                サイトマップ
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/cases"
                    className="hover:text-primary-light transition-colors"
                  >
                    導入事例
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="hover:text-primary-light transition-colors"
                  >
                    製品詳細
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order"
                    className="hover:text-primary-light transition-colors"
                  >
                    価格・注文
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary-light transition-colors"
                  >
                    よくある質問
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary-light">
                お問い合わせ
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary-light transition-colors"
                  >
                    お問い合わせフォーム
                  </Link>
                </li>
                <li>
                  運営:{" "}
                  <a
                    href="https://senrigan.systems/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-light transition-colors"
                  >
                    株式会社Senrigan
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-light/20 pt-8 text-center text-sm text-bg-cream/75">
            <p>
              &copy; 2025 One Tap Seal by Senrigan Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
