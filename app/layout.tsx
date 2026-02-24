import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Black_Han_Sans,
  East_Sea_Dokdo,
} from "next/font/google";
import Script from 'next/script'; // [추가] Script 컴포넌트 임포트

import "./globals.css";

// ===== 폰트 설정 (기존 유지) =====
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
});

const eastSeaDokdo = East_Sea_Dokdo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dialogue",
});

export const metadata: Metadata = {
  title: "The Fighting Persona Test",
  description: "Which fighter are you most like?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // [설정] 본인의 GA4 측정 ID를 여기에 적으세요!
  const GA_ID = "GTM-WGXF5QLZ"; 

  return (
    <html lang="ko">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${blackHanSans.variable}
          ${eastSeaDokdo.variable}
          antialiased
          bg-[#050505]
          text-white
        `}
      >
        {children}

        {/* --- 1. 사운드클라우드 API 스크립트 --- */}
        <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />

        {/* --- 2. Google Analytics 4 스크립트 --- */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}