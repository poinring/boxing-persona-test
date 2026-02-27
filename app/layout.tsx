import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Black_Han_Sans,
  East_Sea_Dokdo,
} from "next/font/google";
import Script from 'next/script';
import BGMPlayer from "@/components/BGMPlayer";
import LangSwitcher from "@/components/LangSwitcher";
import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "@/components/Footer"; // 1. 푸터 임포트 추가
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

// ===== 메타데이터 (기존 유지) =====
export const metadata: Metadata = {
  title: '어이, 링 위로 올라와! | 복싱 성향 테스트',
  description: '링 위에 자리 하나 남는데 네 재능이나 좀 보고 가자고.',
  openGraph: {
    title: '더파이팅 복싱 성향 테스트',
    description: '어이, 주먹은 폼이냐? 10초만 링 위로 올라와봐라. 네놈 재능 좀 보게.',
    images: [
      {
        url: '/images/characters/char_og_2.png',
        width: 1200,
        height: 630,
        alt: '카모가와 관장님의 복싱 성향 테스트',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GTM_ID = "GTM-WGXF5QLZ";

  return (
    <html lang="ko">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
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
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <LanguageProvider>
          <LangSwitcher />
          
          {children}

          {/* 2. 모든 페이지 공통 푸터 삽입 */}
          <Footer />

          <BGMPlayer />
        </LanguageProvider>

        <Script 
          src="https://w.soundcloud.com/player/api.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}