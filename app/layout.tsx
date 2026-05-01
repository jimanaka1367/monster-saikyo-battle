import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "モンスター最強決定バトル",
  description: "ダークファンタジー図鑑風のモンスターバトルWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
