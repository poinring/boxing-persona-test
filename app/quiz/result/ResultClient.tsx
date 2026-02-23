"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ResultClient({
  questions,
  characters,
  answers
}: {
  questions: any[];
  characters: any[];
  answers: (number | string)[];
}) {
  const router = useRouter();

  // [로직 생략: 이전과 동일]
  const score = useMemo(() => {
    let agg = 0, tech = 0, men = 0;
    const numericAnswers = answers.map(a => Number(a));
    questions.forEach((q, i) => {
      const answer = numericAnswers[i];
      if (isNaN(answer)) return;
      if (answer === 0) {
        agg += Number(q.agg_a || 0); tech += Number(q.tech_a || 0); men += Number(q.men_a || 0);
      } else {
        agg += Number(q.agg_b || 0); tech += Number(q.tech_b || 0); men += Number(q.men_b || 0);
      }
    });
    return { agg, tech, men };
  }, [questions, answers]);

  const { agg, tech, men } = score;
  const maxPossible = questions.length || 1;
  const percentAgg = Math.round((agg / maxPossible) * 100);
  const percentTech = Math.round((tech / maxPossible) * 100);
  const percentMen = Math.round((men / maxPossible) * 100);

  const character = useMemo(() => {
    if (!characters.length) return null;
    const getDistance = (c: any) => Math.sqrt(Math.pow(Number(c.agg)-agg,2)+Math.pow(Number(c.tech)-tech,2)+Math.pow(Number(c.men)-men,2));
    let closest = characters[0];
    let minDistance = getDistance(closest);
    characters.forEach(c => {
      const dist = getDistance(c);
      if (dist < minDistance) { closest = c; minDistance = dist; }
    });
    return closest;
  }, [characters, agg, tech, men]);

  const bestMatch = characters.find(c => String(c.id) === String(character?.best_match_id));
  const worstMatch = characters.find(c => String(c.id) === String(character?.worst_match_id));

  if (!character) return null;

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
          whileHover={{ scale: 1.1, rotate: -2 }}
          className="bg-red-600 text-white text-[10px] px-3 py-1 font-black mb-6 tracking-[0.3em] skew-x-[-15deg] cursor-default"
        >
          FINAL BOXER ANALYSIS
        </motion.div>

        {/* 잘림 방지가 적용된 메인 타이틀 */}
        <h1 className="font-title text-6xl sm:text-8xl bg-gradient-to-b from-blue-400 via-white to-red-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(220,38,38,0.3)] leading-tight">
          <SafeItalicTitle className="">{character.name_full_kr}</SafeItalicTitle>
        </h1>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-[1.5px] w-12 bg-red-600" />
          <p className="text-xl sm:text-2xl font-black text-blue-400 tracking-tighter italic drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]">
            {character.summary_kr}
          </p>
          <div className="h-[1.5px] w-12 bg-red-600" />
        </div>

        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="relative mt-12 cursor-crosshair"
        >
          <img src={`/images/characters/char_${String(character.id).padStart(2,"0")}.png`} className="h-[400px] sm:h-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_70%)] -z-10" />
        </motion.div>

        <div className="font-dialogue text-2xl sm:text-3xl text-white italic mt-10 leading-tight border-l-8 border-red-600 pl-6 py-4 bg-white/5 max-w-lg shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
          "{character.quote_kr}"
        </div>
      </section>

      {/* 2. 제1보: 주먹의 성질 (능력치 분석) */}
        <section className="w-full max-w-md mb-24 group">
        <div className="flex items-baseline gap-2 mb-6">
            <span className="font-title text-red-600 text-sm italic font-black uppercase">제1보</span>
            <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">주먹의 성질</h2>
        </div>

        {/* 최강 능력치 뱃지 (기획 추가) */}
        {useMemo(() => {
            const stats = [
            { name: "파괴력", val: percentAgg, desc: "상대를 침몰시키는 묵직한 한 방" },
            { name: "기술력", val: percentTech, desc: "링을 지배하는 정교한 컨트롤" },
            { name: "정신력", val: percentMen, desc: "어떤 위기에도 굴하지 않는 근성" },
            ];
            const best = stats.reduce((prev, current) => (prev.val > current.val) ? prev : current);
            
            return (
            <div className="mb-4 flex items-center gap-3 bg-red-600/10 border border-red-600/30 p-3 italic">
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-black uppercase skew-x-[-15deg]">Strong Point</span>
                <span className="text-white font-black text-sm tracking-tighter">
                최강의 자질: <span className="text-red-500">{best.name}</span> — {best.desc}
                </span>
            </div>
            );
        }, [percentAgg, percentTech, percentMen])}

        <div className="space-y-8 bg-zinc-900/40 p-8 border-y-2 border-red-600/30 group-hover:bg-zinc-900/60 transition-all duration-300">
            {[
            { name: "파괴력 (AGG)", value: percentAgg, color: "from-red-600 to-orange-500", labelColor: "text-orange-500" },
            { name: "기술력 (TECH)", value: percentTech, color: "from-blue-600 to-cyan-400", labelColor: "text-blue-400" },
            { name: "정신력 (MEN)", value: percentMen, color: "from-zinc-400 to-white", labelColor: "text-zinc-300" }
            ].map((stat, i) => (
            <div key={i} className="group/stat">
                <div className="flex justify-between items-end mb-3">
                {/* 이름 크기 키움 (text-sm) */}
                <span className="font-black text-sm italic tracking-widest uppercase text-white/70 group-hover/stat:text-white transition-colors">
                    {stat.name}
                </span>
                {/* 수치 강조 */}
                <span className={`font-title text-2xl italic leading-none ${stat.labelColor}`}>
                    {stat.value}%
                </span>
                </div>
                
                {/* 게이지 바를 조금 더 두껍게 (h-4) */}
                <div className="w-full h-4 bg-black border border-white/10 p-[2px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${stat.value}%` }} 
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stat.color} relative shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                >
                    {/* 광택 효과 추가 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
                </div>
            </div>
            ))}
        </div>
        </section>

      {/* 3. 제2보: 관장의 일침 (가로형 이미지 최적화) */}
    <section className="w-full max-w-md mb-24 flex flex-col items-center">
    <div className="flex items-baseline gap-2 mb-6 w-full">
        <span className="font-title text-red-600 text-sm italic font-black">제2보</span>
        <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">압천의 꾸중</h2>
    </div>
    
    <div className="w-full flex flex-col items-center group">
        {/* 관장님 이미지: 너비를 꽉 채우되 가로형임을 고려하여 하단 여백(mb) 조절 */}
        <motion.img 
        whileHover={{ scale: 1.02 }}
        src="/images/characters/coach_2.png" 
        className="w-full h-auto object-contain z-10 mb-[-20px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
        alt="coach"
        />

        {/* 텍스트 박스: 이미지 너비와 맞추고 내부 패딩 최적화 */}
        <div className="bg-white text-black p-6 sm:p-8 rounded-sm border-4 border-black shadow-[10px_10px_0_rgba(220,38,38,0.5)] z-20 w-full relative transition-transform group-hover:-translate-y-1">

        <p className="font-dialogue text-xl sm:text-2xl font-black italic leading-tight mb-4 break-keep">
            {character.coach_comment_kr}
        </p>
        
        <p className="text-sm sm:text-base font-bold text-zinc-600 leading-relaxed border-t-2 border-black/5 pt-4 break-keep">
            {character.coach_analysis_kr}
        </p>
        </div>
    </div>
    </section>

      {/* 4. 제3보: 필살기 (강력한 호버 효과) */}
      <section className="w-full max-w-md mb-24">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black">제3보</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">전율의 피니쉬</h2>
        </div>
        <motion.div 
          whileHover={{ scale: 1.02, rotate: 1 }}
          className="bg-red-600 p-1 shadow-[0_0_40px_rgba(220,38,38,0.2)] cursor-help"
        >
          <div className="bg-black p-8 border-2 border-white/20">
            <h3 className="font-title text-4xl text-red-500 mb-4 italic tracking-tighter text-center leading-none">
              <SafeItalicTitle className="">{character.signature_move}</SafeItalicTitle>
            </h3>
            <p className="text-white/80 text-center text-sm leading-relaxed font-bold break-keep">
              {character.move_description_kr}
            </p>
          </div>
        </motion.div>
      </section>

      {/* 5. 최종보: 상성 (호버 시 카드 들림) */}
      <section className="w-full max-w-md mb-24 space-y-4">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black">최종보</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">숙명의 인연</h2>
        </div>
        {bestMatch && (
          <motion.div whileHover={{ x: 10 }} className="bg-blue-900/10 border-l-4 border-blue-500 p-5 flex items-center gap-5 transition-colors hover:bg-blue-900/20">
            <img src={`/images/characters/char_${String(bestMatch.id).padStart(2,"0")}.png`} className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div>
              <p className="text-[10px] text-blue-400 font-black tracking-widest uppercase mb-1 underline">Best Partner</p>
              <p className="font-black text-xl italic">{bestMatch.name_full_kr}</p>
            </div>
          </motion.div>
        )}
        {worstMatch && (
          <motion.div whileHover={{ x: 10 }} className="bg-red-900/10 border-l-4 border-red-600 p-5 flex items-center gap-5 transition-colors hover:bg-red-900/20">
            <img src={`/images/characters/char_${String(worstMatch.id).padStart(2,"0")}.png`} className="w-16 h-16 rounded-full border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <div>
              <p className="text-[10px] text-red-500 font-black tracking-widest uppercase mb-1 underline">Fatal Rival</p>
              <p className="font-black text-xl italic">{worstMatch.name_full_kr}</p>
            </div>
          </motion.div>
        )}
      </section>

      {/* CTA: 버튼 호버 효과 극대화 */}
      <div className="w-full max-w-md mt-10 space-y-4">
        <motion.button 
          whileHover={{ scale: 1.02, translateY: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert("공유 링크가 복사되었습니다! 🥊"); }}
          className="w-full py-6 bg-red-600 text-white font-title text-3xl italic border-b-8 border-red-900 shadow-[0_20px_40px_rgba(220,38,38,0.3)]"
        >
          <SafeItalicTitle className="">결과 공유하기</SafeItalicTitle>
        </motion.button>
        <button 
          onClick={() => router.push("/")}
          className="w-full py-4 text-white/30 hover:text-white font-black text-xs tracking-[0.3em] uppercase transition-colors"
        >
          BACK TO GYM (다시 도전하기)
        </button>
      </div>
    </main>
  );
}