import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kohei Yamaguchi | Portfolio",
  description: "Kohei Yamaguchiのプロフィールと制作物を紹介するポートフォリオサイトです。",
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
