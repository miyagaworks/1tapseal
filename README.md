# ワンタップシール (1tapseal.com)

「かざすだけ」でつながる世界を創る - NFCタグシールのWebサイト

## プロジェクト概要

ワンタップシールは、QRコードに代わる新しい情報アクセス手段として、透明なNFCタグシールを提供するサービスです。

### 核心価値
- 「かざすだけ」の圧倒的な体験
- 透明で馴染むデザイン性
- 誰も取り残さない優しさ

### 最優先ターゲット
- 美術館・博物館（高齢者来館者が多い）
- 病院・クリニック（高齢患者が多い）

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **リンティング**: ESLint
- **デプロイ**: Vercel (予定)

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番環境での起動
npm start
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## プロジェクト構成

```
1tapseal/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── docs/                  # ドキュメント
│   ├── WEBSITE_PLAN.md    # Webサイト実装計画書
│   └── WEBSITE_PLAN.html  # 計画書HTML版
├── public/                # 静的ファイル
└── README.md             # このファイル
```

## 必要な画像アセット

### ヒーローセクション
- `qr-code-confused.jpg` (600x400px) - QRコードに困惑する高齢者
- `nfc-happy.jpg` (600x400px) - ワンタップシールで笑顔の高齢者

### 活用シーン
- `museum-usage.jpg` (800x600px) - 美術館での使用イメージ
- `clinic-usage.jpg` (800x600px) - クリニックでの使用イメージ

### 透明シールの可能性
- `transparent-wood.jpg` (600x400px) - 木目テーブルに貼ったシール
- `transparent-glow.jpg` (600x400px) - 夜光シールとの組み合わせ
- `transparent-color.jpg` (600x400px) - カラーシールとの組み合わせ
- `transparent-design.jpg` (600x400px) - 既存デザインの上に貼付

### お客様の声
- `customer-okada.jpg` (100x100px) - 岡田さんのプロフィール画像
- `customer-yamada.jpg` (100x100px) - 山田さんのプロフィール画像

## デザインコンセプト

### カラースキーム
- **プライマリー**: `#1a237e` (ディープブルー) - 信頼性・先進性
- **セカンダリー**: `#00bcd4` (シアン) - クリーン・テクノロジー
- **アクセント**: `#4CAF50` (グリーン) - CTA、成功メッセージ

### レスポンシブデザイン
- **モバイルファースト**: スマホ表示を最優先
- **ブレークポイント**: Tailwind CSSのデフォルト (sm: 640px, md: 768px, lg: 1024px)

## 実装フェーズ

### フェーズ 1: MVP（完了）
- ✅ トップページの実装
- ✅ レスポンシブデザイン
- ✅ 基本的なCTA配置

### フェーズ 2: コンテンツページ（次のステップ）
- 導入事例ページ
- 製品詳細ページ
- 価格・注文ページ
- FAQページ

### フェーズ 3: 機能実装
- 注文フォーム
- 資料ダウンロード機能
- お問い合わせフォーム
- 決済機能（Stripe連携）

## 運営会社

**株式会社Senrigan**
- ウェブサイト: https://senrigan.systems
- お問い合わせ: contact@senrigan.systems

## ライセンス

© 2024 ワンタップシール by 株式会社Senrigan. All rights reserved.
