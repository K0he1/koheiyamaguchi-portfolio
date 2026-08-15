import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K Lab Studio",
  description: "K Lab Studioは、Kohei Yamaguchiのプロフィールや制作物を紹介し、お問い合わせを受け付けるポートフォリオサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
