import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Black_Han_Sans,
  East_Sea_Dokdo,
} from "next/font/google";

import "./globals.css";


// ===== 기본 UI 폰트 =====
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// ===== 만화 타이틀 폰트 =====
const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
});


// ===== 말풍선 대사용 폰트 =====
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
      </body>
    </html>
  );
}

import Script from 'next/script';

<Script src="https://w.soundcloud.com/player/api.js" />