// components/LangSwitcher.tsx
'use client';
import { useLang } from '@/context/LanguageContext';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="fixed top-5 left-5 z-[10001] flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-2xl">
      {['ko', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l as 'ko' | 'en')}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${
            lang === l 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'text-white/40 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}