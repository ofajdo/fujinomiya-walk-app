import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SyncUserLocation } from "@/components/Sync";
import { Analytics } from "@vercel/analytics/next";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "富士宮市歩く博物館デジタル",
  description:
    "富士宮市歩く博物館のデジタル版です。富士宮水の歩く博物館の紹介をしています。歩くルートをデジタルのマップで見ることができます。パンフレットとガイドブックを参考にしています",
  verification: {
    google: "pN0H3UKaXSIYAoZW9gR1IEyLjFql2k2mErkNYOn9Rbc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning className={notoSansJP.className}>
        {/* <SyncUserLocation>{children}</SyncUserLocation>
        <Analytics /> */}
        {children}
      </body>
    </html>
  );
}
