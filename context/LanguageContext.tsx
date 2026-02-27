// context/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'ko' | 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (ko: any, en: any) => any; // 언어별 텍스트 선택 헬퍼 함수
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
  t: (ko) => ko,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko');

  useEffect(() => {
    // 1. 로컬 스토리지 확인
    const saved = localStorage.getItem('app_lang') as Lang;
    // 2. 브라우저 언어 확인
    const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
    setLang(saved || browserLang);
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('app_lang', l);
    // html 태그의 lang 속성도 변경 (SEO 및 접근성용)
    document.documentElement.lang = l;
  };

  // 현재 언어에 맞는 값을 반환하는 헬퍼
  const t = (ko: any, en: any) => (lang === 'ko' ? ko : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);