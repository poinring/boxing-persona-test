"use client";

import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="w-full py-12 border-t border-white/5 bg-[#050505] flex flex-col items-center gap-6">
      {/* 채널 링크 섹션 */}
      <div className="flex items-center gap-4 sm:gap-6 opacity-60 hover:opacity-100 transition-opacity">
        <a 
          href="https://www.youtube.com/@po.inring" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2"
        >
          <span className="font-title text-[10px] tracking-[0.2em] text-white italic uppercase">
            {t("공식 유튜브", "Official YouTube")}
          </span>
          <span className="font-title text-red-600 text-sm italic font-black group-hover:underline">
            @PO.INRING
          </span>
        </a>
        
        <div className="h-3 w-[1px] bg-white/20" />

        <span className="font-title text-[10px] tracking-[0.2em] text-zinc-500 italic uppercase">
          © 2026 POINRING.
        </span>
      </div>

      {/* 저작권 면책 조항 (추가된 부분) */}
      <div className="flex flex-col items-center gap-1 px-6 text-center">
        <p className="text-[9px] text-zinc-600 font-medium leading-relaxed uppercase tracking-tighter">
          This is a non-profit fan project. 
          Images from 'Hajime no Ippo' © George Morikawa / Kodansha.
          Music provided via SoundCloud.
        </p>
        <p className="text-[9px] text-zinc-700">
          모든 이미지와 음악의 권리는 원저작권자에게 있으며, 본 사이트는 영리 목적으로 운영되지 않습니다.
        </p>
      </div>
    </footer>
  );
}