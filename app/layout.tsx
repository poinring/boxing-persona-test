import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Black_Han_Sans,
  East_Sea_Dokdo,
} from "next/font/google";
import Script from 'next/script';
import BGMPlayer from "@/components/BGMPlayer";
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
  // 전달해주신 GTM ID
  const GTM_ID = "GTM-WGXF5QLZ";

  return (
    <html lang="ko">
      <head>
        {/* --- 1. Google Tag Manager (Head 영역) --- */}
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
        {/* --- 2. Google Tag Manager (noscript, Body 최상단 배치) --- */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <BGMPlayer />
        {/* --- 3. 사운드클라우드 API 스크립트 --- */}
        <Script 
          src="https://w.soundcloud.com/player/api.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}

