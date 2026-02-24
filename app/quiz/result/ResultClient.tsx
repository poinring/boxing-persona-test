"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ResultClient({
  characters
}: {
  characters: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. URL에서 score 데이터를 가져와 파싱합니다.
  const score = useMemo(() => {
    const scoreParam = searchParams.get("score");
    if (scoreParam) {
      try {
        return JSON.parse(decodeURIComponent(scoreParam));
      } catch (e) {
        console.error("Score parsing error:", e);
      }
    }
    return { agg: 0, tech: 0, men: 0 };
  }, [searchParams]);

  const { agg, tech, men } = score;
  
  // 총 질문 수(10개) 기준으로 퍼센트 계산
  const totalQuestions = 10; 
  const percentAgg = Math.min(Math.round((agg / totalQuestions) * 100), 100);
  const percentTech = Math.min(Math.round((tech / totalQuestions) * 100), 100);
  const percentMen = Math.min(Math.round((men / totalQuestions) * 100), 100);

  // 2. 캐릭터 매칭 로직 (유클리드 거리 기반 최단 거리 캐릭터 매칭)
  const character = useMemo(() => {
    if (!characters.length) return null;
    
    const getDistance = (c: any) => {
      // 캐릭터 시트의 점수(0~10점 사이로 기록됨)와 유저의 획득 점수 차이 계산
      return Math.sqrt(
        Math.pow(Number(c.agg) - agg, 2) +
        Math.pow(Number(c.tech) - tech, 2) +
        Math.pow(Number(c.men) - men, 2)
      );
    };

    let closest = characters[0];
    let minDistance = getDistance(closest);

    characters.forEach((c) => {
      const dist = getDistance(c);
      if (dist < minDistance) {
        closest = c;
        minDistance = dist;
      }
    });
    return closest;
  }, [characters, agg, tech, men]);

  const bestMatch = characters.find(c => String(c.id) === String(character?.best_match_id));
  const worstMatch = characters.find(c => String(c.id) === String(character?.worst_match_id));

  if (!character) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      판정단을 불러오는 중...
    </div>
  );

  // 잘림 방지용 타이틀 컴포넌트
  function SafeItalicTitle({ children, className }: { children: React.ReactNode; className: string }) {
    return (
      <span className={`${className} italic pr-4 inline-block`}>
        {children}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-16 flex flex-col items-center overflow-x-hidden font-ui">
      
      {/* 1. 메인 판정: 히어로 섹션 */}
      <section className="flex flex-col items-center text-center mb-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white text-[10px] px-3 py-1 font-black mb-6 tracking-[0.3em] skew-x-[-15deg] cursor-default"
        >
          FINAL BOXER ANALYSIS
        </motion.div>

        <h1 className="font-title text-6xl sm:text-8xl bg-gradient-to-b from-blue-400 via-white to-red-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(220,38,38,0.3)] leading-tight">
          <SafeItalicTitle className="">{character.name_full_kr}</SafeItalicTitle>
        </h1>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-[1.5px] w-12 bg-red-600" />
          <p className="text-xl sm:text-2xl font-black text-blue-400 tracking-tighter italic">
            {character.summary_kr}
          </p>
          <div className="h-[1.5px] w-12 bg-red-600" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mt-12 cursor-crosshair"
        >
          <img 
            src={`/images/characters/char_${String(character.id).padStart(2,"0")}.png`} 
            className="h-[400px] sm:h-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]" 
            alt={character.name_short_kr}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_70%)] -z-10" />
        </motion.div>

        <div className="font-dialogue text-2xl sm:text-3xl text-white italic mt-10 leading-tight border-l-8 border-red-600 pl-6 py-4 bg-white/5 max-w-lg">
          "{character.quote_kr}"
        </div>
      </section>

      {/* 2. 제1보: 주먹의 성질 (능력치 분석) */}
      <section className="w-full max-w-md mb-24 group">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black uppercase">제1보</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">주먹의 성질</h2>
        </div>

        {/* 최강 능력치 뱃지 */}
        <div className="mb-4 flex items-center gap-3 bg-red-600/10 border border-red-600/30 p-3 italic">
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-black uppercase skew-x-[-15deg]">Strong Point</span>
            <span className="text-white font-black text-sm tracking-tighter">
            {percentAgg >= percentTech && percentAgg >= percentMen && "압도적인 파괴력의 소유자"}
            {percentTech > percentAgg && percentTech >= percentMen && "정교한 기술의 테크니션"}
            {percentMen > percentAgg && percentMen > percentTech && "꺾이지 않는 강철 멘탈"}
            </span>
        </div>

        <div className="space-y-8 bg-zinc-900/40 p-8 border-y-2 border-red-600/30">
          {[
            { name: "파괴력 (AGG)", value: percentAgg, color: "from-red-600 to-orange-500", labelColor: "text-orange-500" },
            { name: "기술력 (TECH)", value: percentTech, color: "from-blue-600 to-cyan-400", labelColor: "text-blue-400" },
            { name: "정신력 (MEN)", value: percentMen, color: "from-zinc-400 to-white", labelColor: "text-zinc-300" }
          ].map((stat, i) => (
            <div key={i} className="group/stat">
              <div className="flex justify-between items-end mb-3">
                <span className="font-black text-sm italic tracking-widest text-white/70 group-hover/stat:text-white transition-colors">
                    {stat.name}
                </span>
                <span className={`font-title text-2xl italic leading-none ${stat.labelColor}`}>
                    {stat.value}%
                </span>
              </div>
              <div className="w-full h-4 bg-black border border-white/10 p-[2px] overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${stat.value}%` }} 
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stat.color} relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 제2보: 관장의 일침 */}
      <section className="w-full max-w-md mb-24 flex flex-col items-center">
        <div className="flex items-baseline gap-2 mb-6 w-full">
          <span className="font-title text-red-600 text-sm italic font-black">제2보</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">압천의 일침</h2>
        </div>
        <div className="w-full flex flex-col items-center group">
          <img src="/images/characters/coach_2.png" className="w-full h-auto object-contain z-10 mb-[-20px]" alt="coach" />
          <div className="bg-white text-black p-6 sm:p-8 rounded-sm border-4 border-black shadow-[10px_10px_0_rgba(220,38,38,0.5)] z-20 w-full relative">
            <p className="font-dialogue text-xl sm:text-2xl font-black italic leading-tight mb-4 break-keep">
              {character.coach_comment_kr}
            </p>
            <p className="text-sm sm:text-base font-bold text-zinc-600 leading-relaxed border-t-2 border-black/5 pt-4 break-keep">
              {character.coach_analysis_kr}
            </p>
          </div>
        </div>
      </section>

      {/* 4. 제3보: 필살기 */}
      <section className="w-full max-w-md mb-24">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black">제3보</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">전율의 피니쉬</h2>
        </div>
        <div className="bg-red-600 p-1">
          <div className="bg-black p-8 border-2 border-white/20 text-center">
            <h3 className="font-title text-4xl text-red-500 mb-4 italic tracking-tighter">
              <SafeItalicTitle className="">{character.signature_move}</SafeItalicTitle>
            </h3>
            <p className="text-white/80 text-sm leading-relaxed font-bold break-keep">
              {character.move_description_kr}
            </p>
          </div>
        </div>
      </section>

      {/* 5. 최종보: 상성 */}
      <section className="w-full max-w-md mb-24 space-y-4">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black">최종보</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">숙명의 인연</h2>
        </div>
        {bestMatch && (
          <div className="bg-blue-900/10 border-l-4 border-blue-500 p-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 bg-zinc-800 overflow-hidden">
               <img src={`/images/characters/char_${String(bestMatch.id).padStart(2,"0")}.png`} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] text-blue-400 font-black tracking-widest uppercase mb-1">Best Partner</p>
              <p className="font-black text-xl italic">{bestMatch.name_full_kr}</p>
            </div>
          </div>
        )}
        {worstMatch && (
          <div className="bg-red-900/10 border-l-4 border-red-600 p-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-red-600 bg-zinc-800 overflow-hidden">
               <img src={`/images/characters/char_${String(worstMatch.id).padStart(2,"0")}.png`} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] text-red-500 font-black tracking-widest uppercase mb-1">Fatal Rival</p>
              <p className="font-black text-xl italic">{worstMatch.name_full_kr}</p>
            </div>
          </div>
        )}
      </section>

      {/* CTA 버튼들 */}
      <div className="w-full max-w-md mt-10 space-y-4">
        <button 
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert("공유 링크가 복사되었습니다! 🥊"); }}
          className="w-full py-6 bg-red-600 text-white font-title text-3xl italic border-b-8 border-red-900"
        >
          <SafeItalicTitle className="">결과 공유하기</SafeItalicTitle>
        </button>
        <button 
          onClick={() => router.push("/")}
          className="w-full py-4 text-white/30 hover:text-white font-black text-xs tracking-[0.3em] uppercase"
        >
          BACK TO GYM (다시 도전하기)
        </button>
      </div>
    </main>
  );
}