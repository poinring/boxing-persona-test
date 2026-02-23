"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="
        min-h-screen
        flex flex-col items-center
        justify-start
        overflow-hidden
        relative
        bg-[#050505]
      "
    >
      {/* ================= BACKGROUND: 체육관의 열기 ================= */}
      <div className="absolute inset-0 -z-10">
        {/* 배경 캐릭터에 모션감 추가 (스케일업 효과) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15),transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
      </div>

      {/* ================= HEADER: 타이틀 & 서사 ================= */}
      <header className="w-full max-w-3xl px-6 mt-10 sm:mt-12 text-center z-30 relative">
        {/* 장식용 서브 텍스트 */}
        <div className="inline-block bg-white text-black px-3 py-0.5 text-[10px] font-black tracking-[0.3em] mb-4 skew-x-[-15deg]">
          KAMOGAWA BOXING GYM PRESENT
        </div>

        <h1
          className="
            font-title
            text-[4rem] sm:text-[6.5rem] md:text-[7.5rem]
            leading-[0.85] tracking-tighter
            bg-clip-text text-transparent
            bg-gradient-to-b from-blue-400 via-white to-red-500
            drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]
            italic
          "
        >
          더 파이팅!
        </h1>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm sm:text-base text-white/90 font-bold tracking-widest uppercase italic border-b border-red-600 pb-1">
            당신은 어떤 복서 타입인가?
          </p>
          
        </div>
      </header>

      {/* ================= CHARACTER SECTION: 도전의 초대 ================= */}
      <section
        className="
          relative z-20 w-full max-w-2xl px-4
          flex flex-col items-center
          mt-2 sm:mt-4
        "
      >
        {/* 메인 캐릭터 이미지 - 좀 더 역동적인 배치 */}
        <div className="relative group">
          <Image
            src="/images/characters/char_09_v2.png"
            alt="character"
            width={800}
            height={1200}
            priority
            className="
              h-[62vh] sm:h-[70vh]
              w-auto
              object-contain
              drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]
              transition-transform duration-500 group-hover:scale-[1.02]
            "
          />
          {/* 하단 안개 효과 (캐릭터와 배경 분리) */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        </div>

        {/* CTA BUTTON: 링 위로의 초대 */}
        <Link href="/quiz" className="w-full max-w-md z-30 -mt-8 sm:-mt-12">
          <button
            className="
              group
              relative
              w-full
              py-6 sm:py-8
              bg-gradient-to-b from-red-500 to-red-700
              border-b-[6px] border-red-950
              rounded-lg
              shadow-[0_20px_50px_rgba(224,49,49,0.4)]
              active:translate-y-1
              active:border-b-0
              transition-all duration-150
            "
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span
              className="
                font-title
                text-3xl sm:text-4xl
                text-white
                italic
                drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]
                tracking-tight
              "
            >
              링 위로 올라가기
            </span>
            <div className="text-[10px] text-white/60 font-bold mt-1 tracking-widest group-hover:text-white transition-colors">
              ARE YOU READY TO FIGHT?
            </div>
          </button>
        </Link>

        {/* 말풍선: 애니메이션(animate-bounce-slow) 제거, 꼬리 제거, 디자인 심플화 */}
          <div className="absolute right-4 top-[12%] sm:right-6 sm:top-[15%] 
                          bg-white text-black border-[4px] border-black p-4 sm:p-5 
                          rounded-none shadow-[10px_10px_0_rgba(255,255,255,0.1)] 
                          -rotate-2 z-40">
            <p className="font-dialogue text-xl sm:text-2xl font-black italic leading-none tracking-tighter">
              어이! 비실대지 말고<br/>당장 링 위로 올라와!
            </p>
          </div>
      </section>

      {/* ================= FOOTER DECORATION ================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30 z-0">
        <div className="h-[1px] w-20 bg-white" />
        <span className="text-[10px] font-bold tracking-[0.5em] text-white uppercase whitespace-nowrap">
          The Fighting Personality Test
        </span>
        <div className="h-[1px] w-20 bg-white" />
      </div>
    </main>
  );
}