import Link from "next/link";
import {
  MdNfc, MdPhoneAndroid, MdTimer, MdWaterDrop,
  MdTexture, MdLightMode, MdSecurity, MdSpeed,
  MdCheckCircle, MdInfo, MdWarning, MdArrowBack
} from "react-icons/md";

export default function ProductPage() {
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
            <MdInfo className="text-4xl md:text-5xl text-text-dark" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              製品詳細
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 製品概要 */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 mb-8 border-l-4 border-primary">
              <h2 className="text-2xl font-bold text-text-dark mb-3">
                ワンタップシールとは
              </h2>
              <p className="text-text-medium text-justify">
                ワンタップシールは、NFC（Near Field Communication）技術を搭載した透明シールです。
                スマートフォンをかざすだけで指定したWebページに瞬時にアクセスでき、
                QRコードよりも直感的で使いやすい新しい情報共有の形を実現します。
              </p>
            </div>
          </section>

          {/* 技術仕様 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-dark mb-6">技術仕様</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-center gap-3 mb-4">
                  <MdNfc className="text-3xl text-accent-light" />
                  <h3 className="font-bold text-text-dark">NFC規格</h3>
                </div>
                <p className="text-text-medium">
                  <span className="font-semibold">規格：</span>NFC Type 2（ISO/IEC 14443 Type A）<br/>
                  <span className="font-semibold">チップ：</span>NXP - NTAG213<br/>
                  <span className="font-semibold">メモリ容量：</span>180バイト（45ページ × 4バイト）
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-center gap-3 mb-4">
                  <MdTexture className="text-3xl text-accent-light" />
                  <h3 className="font-bold text-text-dark">サイズ・材質</h3>
                </div>
                <p className="text-text-medium">
                  <span className="font-semibold">サイズ：</span>直径 30mm（標準）<br/>
                  <span className="font-semibold">厚さ：</span>約 0.3mm<br/>
                  <span className="font-semibold">材質：</span>PET樹脂（透明）
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-center gap-3 mb-4">
                  <MdPhoneAndroid className="text-3xl text-accent-light" />
                  <h3 className="font-bold text-text-dark">対応デバイス</h3>
                </div>
                <p className="text-text-medium">
                  <span className="font-semibold">iPhone：</span>iPhone 7以降（iOS 11以降）<br/>
                  <span className="font-semibold">Android：</span>NFC搭載端末<br/>
                  <span className="font-semibold">アプリ：</span>不要（標準機能で動作）
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-center gap-3 mb-4">
                  <MdSpeed className="text-3xl text-accent-light" />
                  <h3 className="font-bold text-text-dark">読み取り性能</h3>
                </div>
                <p className="text-text-medium">
                  <span className="font-semibold">読み取り距離：</span>1〜3cm<br/>
                  <span className="font-semibold">読み取り時間：</span>0.3秒以下<br/>
                  <span className="font-semibold">成功率：</span>98%以上
                </p>
              </div>
            </div>
          </section>

          {/* 特徴 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-dark mb-6">製品の特徴</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-start gap-4">
                  <MdLightMode className="text-3xl text-accent-light flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">完全透明</h3>
                    <p className="text-text-medium text-justify">
                      貼付場所のデザインを損なわない透明素材を使用。
                      ポスター、パンフレット、商品パッケージなど、あらゆる場所に違和感なく設置できます。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-start gap-4">
                  <MdWaterDrop className="text-3xl text-accent-light flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">防水仕様</h3>
                    <p className="text-text-medium text-justify">
                      屋外での使用にも耐える防水仕様。
                      雨や水滴がかかる環境でも安心してご使用いただけます。
                      ただし、完全防水ではないため、水中での使用は避けてください。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-start gap-4">
                  <MdTimer className="text-3xl text-accent-light flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">長期利用可能</h3>
                    <p className="text-text-medium text-justify">
                      電池不要のNFC技術により、半永久的に使用可能。
                      定期的なメンテナンスや交換の手間がなく、一度設置すれば長期間ご利用いただけます。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <div className="flex items-start gap-4">
                  <MdSecurity className="text-3xl text-accent-light flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">書き換え不可</h3>
                    <p className="text-text-medium text-justify">
                      出荷時にURLをロックするため、第三者による改ざんを防止。
                      セキュリティ面でも安心してご利用いただけます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 使用上の注意 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-dark mb-6">使用上の注意事項</h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <MdWarning className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">金属面への貼付</h3>
                    <p className="text-text-medium text-justify">
                      金属面に直接貼ると、NFCの電波が遮断され動作しません。
                      金属製品への設置は避けてください。プラスチックや紙、木材など、非金属の素材に貼付することをおすすめします。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <MdWarning className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">貼付面の状態</h3>
                    <p className="text-text-medium text-justify">
                      貼付面が汚れていたり、凹凸が激しい場合、粘着力が低下する可能性があります。
                      事前に貼付面を清掃し、乾燥させてから貼付してください。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <MdWarning className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">再利用不可</h3>
                    <p className="text-text-medium text-justify">
                      一度剥がしたシールは粘着力が低下し、再利用できません。
                      また、書き込まれたURLの変更もできませんので、貼付位置や設定URLは慎重にご検討ください。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <MdWarning className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">高温多湿環境</h3>
                    <p className="text-text-medium text-justify">
                      直射日光が長時間当たる場所や、極端に高温・多湿な環境では、粘着力が低下する可能性があります。
                      屋外使用の場合は、日陰や庇のある場所への設置をおすすめします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 動作確認端末 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-dark mb-6">動作確認済み端末</h2>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <div className="mb-6">
                <h3 className="font-bold text-text-dark mb-3 flex items-center gap-2">
                  <MdCheckCircle className="text-accent-light" />
                  iPhone
                </h3>
                <p className="text-text-medium pl-7">
                  iPhone 15 Pro Max / iPhone 15 Pro / iPhone 15 Plus / iPhone 15<br/>
                  iPhone 14 Pro Max / iPhone 14 Pro / iPhone 14 Plus / iPhone 14<br/>
                  iPhone 13 Pro Max / iPhone 13 Pro / iPhone 13 mini / iPhone 13<br/>
                  iPhone 12 Pro Max / iPhone 12 Pro / iPhone 12 mini / iPhone 12<br/>
                  iPhone 11 Pro Max / iPhone 11 Pro / iPhone 11<br/>
                  iPhone XS Max / iPhone XS / iPhone XR / iPhone X<br/>
                  iPhone 8 Plus / iPhone 8 / iPhone 7 Plus / iPhone 7
                </p>
              </div>

              <div>
                <h3 className="font-bold text-text-dark mb-3 flex items-center gap-2">
                  <MdCheckCircle className="text-accent-light" />
                  Android
                </h3>
                <p className="text-text-medium pl-7">
                  Google Pixel 8 Pro / Pixel 8 / Pixel 7 Pro / Pixel 7 / Pixel 6 Pro / Pixel 6<br/>
                  Samsung Galaxy S24 Ultra / S24+ / S24 / S23 Ultra / S23+ / S23<br/>
                  Sony Xperia 1 V / Xperia 5 V / Xperia 10 V<br/>
                  その他、NFC搭載のAndroid端末
                </p>
                <p className="text-text-medium pl-7 mt-3 text-sm text-amber-700">
                  ※ Android端末の場合、機種によってNFC読み取り位置が異なります。<br/>
                  ※ 一部の格安スマートフォンではNFC機能が搭載されていない場合があります。
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-8 border-l-4 border-primary text-center">
              <h3 className="text-xl font-bold text-text-dark mb-4">
                ワンタップシールを試してみませんか？
              </h3>
              <p className="text-text-medium mb-6">
                1枚から注文可能です。まずは少量でお試しください。
              </p>
              <Link
                href="/order"
                className="inline-block bg-accent hover:bg-accent-light text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                ご注文はこちら
              </Link>
            </div>
          </section>

          {/* その他のページへのリンク */}
          <section>
            <div className="bg-bg-cream rounded-lg p-6">
              <h3 className="font-bold text-text-dark mb-4">その他のページ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/faq"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">よくある質問 →</span>
                </Link>
                <Link
                  href="/cases"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">導入事例 →</span>
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
