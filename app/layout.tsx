import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K's Home Page",
  description: "K's Home Pageは、Kohei Yamaguchiのプロフィールや制作物を紹介し、お問い合わせを受け付けるポートフォリオサイトです。",
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
