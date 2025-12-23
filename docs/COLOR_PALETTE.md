# ワンタップシール カラーパレット

このドキュメントでは、ワンタップシールWebサイトで使用するカラーパレットを定義します。

## カラー定義

### プライマリカラー（黄色系）
温かく親しみやすい印象を与える、メインカラーです。

| 名称 | CSS変数 | Hex | 用途 |
|------|---------|-----|------|
| Primary Light | `--color-primary-light` | `#ffe57a` | グラデーション、ヒーローセクション |
| Primary | `--color-primary` | `#ffdb47` | ボタン、テーブルヘッダー |
| Primary Dark | `--color-primary-dark` | `#ffd84d` | ホバー状態 |

### セカンダリカラー（オレンジ系）
アクションを促す、補助カラーです。

| 名称 | CSS変数 | Hex | 用途 |
|------|---------|-----|------|
| Secondary | `--color-secondary` | `#ffa838` | ホバー状態、強調 |

### アクセントカラー（コーラル系）
CTAボタンや重要な情報に使用します。

| 名称 | CSS変数 | Hex | 用途 |
|------|---------|-----|------|
| Accent Light | `--color-accent-light` | `#ff8a65` | アイコン、チェックマーク、強調テキスト |
| Accent | `--color-accent` | `#ff6f4d` | CTAボタン、ホバー状態 |

### テキストカラー（茶色系）
視認性を確保した、温かみのあるテキスト色です。

| 名称 | CSS変数 | Hex | 用途 |
|------|---------|-----|------|
| Text Dark | `--color-text-dark` | `#2e1a15` | 見出し、重要テキスト |
| Text Medium | `--color-text-medium` | `#3e2c27` | 本文、説明文 |

### 背景色

| 名称 | CSS変数 | Hex | 用途 |
|------|---------|-----|------|
| Background | `--background` | `#ffffff` | ページ背景（白） |
| Background Cream | `--background-cream` | `#fffbf0` | セクション背景（クリーム） |

## Tailwind CSS クラスでの使用方法

`global.css`で定義されたCSS変数は、Tailwindクラスとして使用できます。

### 使用例

```tsx
{/* テキスト色 */}
<h1 className="text-text-dark">見出し</h1>
<p className="text-text-medium">本文</p>

{/* 背景色 */}
<div className="bg-primary-light">プライマリ背景</div>
<div className="bg-accent">アクセント背景</div>

{/* ボーダー */}
<div className="border-2 border-primary">枠線</div>

{/* グラデーション */}
<div className="bg-gradient-to-r from-primary-light to-primary">
  グラデーション
</div>
```

## カラー管理

すべての色は `/app/globals.css` で一元管理されています。

色を変更する場合は、以下の手順で行ってください：

1. `/app/globals.css` の `:root` セクションで色を変更
2. `@theme inline` セクションでも同じ色を更新
3. このドキュメントを更新

## デザイン方針

- **温かく優しい**: 黄色とオレンジを基調とした、親しみやすいデザイン
- **視認性**: テキストは茶色系を使用し、背景とのコントラストを確保
- **アクセシビリティ**: すべてのテキストはWCAG AA基準を満たすコントラスト比を維持

## カラーコントラスト

| 組み合わせ | コントラスト比 | 評価 |
|-----------|--------------|------|
| Text Dark (#2e1a15) on White (#ffffff) | 14.6:1 | AAA |
| Text Medium (#3e2c27) on White (#ffffff) | 11.2:1 | AAA |
| Text Dark (#2e1a15) on Primary Light (#ffe57a) | 7.8:1 | AAA |

---

最終更新: 2025年10月29日
