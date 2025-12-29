import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ワンタップシール | QRコードより便利なNFCタグシール",
  description:
    "「もっと簡単につながる世界を創る」というビジョンのもと、NFC技術を使って様々なURLを共有できるサービス。それが「スマホでかざすだけ！」ワンタップシールです。",
  keywords: [
    "ワンタップシール",
    "NFCタグ",
    "NFCシール",
    "QRコード代替",
    "スマートタグ",
    "非接触",
    "美術館",
    "病院",
    "観光地",
  ],
  authors: [{ name: "株式会社Senrigan" }],
  openGraph: {
    title: "ワンタップシール | かざすだけで情報にアクセス",
    description:
      "QRコードはもう古い。スマホをかざすだけの新体験。NFCタグシールで誰もが使いやすい情報アクセスを実現。",
    url: "https://1tapseal.com",
    siteName: "ワンタップシール",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://1tapseal.com/images/ogp.jpg",
        width: 1200,
        height: 630,
        alt: "ワンタップシール - NFCタグシール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ワンタップシール | かざすだけで情報にアクセス",
    description: "QRコードはもう古い。スマホをかざすだけの新体験。",
    images: ["https://1tapseal.com/images/ogp.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
