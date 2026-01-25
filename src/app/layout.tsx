import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "청소대행끗 | 결과로 책임지는 전문 청소 서비스",
  description: "입주청소, 상가청소, 특수청소, 정기청소 전문. 말로 잘하는 청소가 아니라, 결과로 책임지는 청소를 합니다. 수천 건 현장에서 검증된 청소 서비스.",
  keywords: ["청소대행", "입주청소", "상가청소", "특수청소", "정기청소", "청소업체", "인천청소"],
  openGraph: {
    title: "청소대행끗 | 결과로 책임지는 전문 청소 서비스",
    description: "입주청소, 상가청소, 특수청소, 정기청소 전문. 수천 건 현장에서 검증된 청소 서비스.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
