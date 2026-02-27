"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext"; // 언어 컨텍스트 임포트

export default function ResultClient({
  id,
  scoreStr,
  characters
}: {
  id: string;
  scoreStr: string;
  characters: any[];
}) {
  const router = useRouter();
  const { lang, t } = useLang(); // 언어 상태 및 번역 함수

  const score = useMemo(() => {
    if (scoreStr && scoreStr.includes("-")) {
      const [a, tVal, m] = scoreStr.split("-").map(Number);
      return { agg: a || 0, tech: tVal || 0, men: m || 0 };
    }
    if (scoreStr && scoreStr.length === 3) {
      return {
        agg: parseInt(scoreStr[0]),
        tech: parseInt(scoreStr[1]),
        men: parseInt(scoreStr[2])
      };
    }
    return { agg: 0, tech: 0, men: 0 };
  }, [scoreStr]);

  const { agg, tech, men } = score;
  const totalQuestions = 10; 
  const percentAgg = Math.min(Math.round((agg / totalQuestions) * 100), 100);
  const percentTech = Math.min(Math.round((tech / totalQuestions) * 100), 100);
  const percentMen = Math.min(Math.round((men / totalQuestions) * 100), 100);

  const character = useMemo(() => {
    return characters.find(c => String(c.id) === String(id)) || null;
  }, [characters, id]);

  // 언어별 데이터 필드 선택 헬퍼
  const getField = (fieldBase: string) => {
    const key = lang === 'ko' ? `${fieldBase}_kr` : `${fieldBase}_en`;
    return character ? character[key] : "";
  };

  useEffect(() => {
    if (character) {
      const windowObj = window as any;
      windowObj.dataLayer = windowObj.dataLayer || [];
      windowObj.dataLayer.push({
        event: 'quiz_finish',
        character_id: character.id,
        character_name: character.name_short_kr,
        final_score: score,
        lang: lang // 분석을 위해 언어 정보도 추가
      });
    }
  }, [character, score, lang]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t("공유 링크가 복사되었습니다! 🥊", "Link copied to clipboard! 🥊"));

    const windowObj = window as any;
    windowObj.dataLayer = windowObj.dataLayer || [];
    windowObj.dataLayer.push({
      event: 'share_click',
      share_method: 'copy_link',
      character_name: character?.name_short_kr
    });
  };

  const bestMatch = characters.find(c => String(c.id) === String(character?.best_match_id));
  const worstMatch = characters.find(c => String(c.id) === String(character?.worst_match_id));

  if (!character) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black italic">
      {t("판정단을 불러오는 중...", "Calling the Judges...")}
    </div>
  );

  function SafeItalicTitle({ children, className }: { children: React.ReactNode; className: string }) {
    return (
      <span className={`${className} italic pr-4 inline-block`}>
        {children}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-16 flex flex-col items-center overflow-x-hidden font-ui">
      {/* 1. 상단 분석 섹션 */}
      <section className="flex flex-col items-center text-center mb-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white text-[10px] px-3 py-1 font-black mb-6 tracking-[0.3em] skew-x-[-15deg] cursor-default"
        >
          FINAL BOXER ANALYSIS
        </motion.div>

        <h1 className="font-title text-5xl sm:text-8xl bg-gradient-to-b from-blue-400 via-white to-red-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(220,38,38,0.3)] leading-tight">
          <SafeItalicTitle className="">{lang === 'ko' ? character.name_full_kr : character.name_full_en}</SafeItalicTitle>
        </h1>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-[1.5px] w-12 bg-red-600" />
          <p className="text-xl sm:text-2xl font-black text-blue-400 tracking-tighter italic">
            {getField('summary')}
          </p>
          <div className="h-[1.5px] w-12 bg-red-600" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mt-12"
        >
          <img 
            src={`/images/characters/char_${String(character.id).padStart(2,"0")}.png`} 
            className="h-[400px] sm:h-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]" 
            alt={character.name_short_kr}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_70%)] -z-10" />
        </motion.div>

        <div className="font-dialogue text-2xl sm:text-3xl text-white italic mt-10 leading-tight border-l-8 border-red-600 pl-6 py-4 bg-white/5 max-w-lg break-keep">
          "{getField('quote')}"
        </div>
      </section>

      {/* 2. 주먹의 성질 분석 */}
      <section className="w-full max-w-md mb-24 group">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black uppercase">{t("제1보", "STEP 1")}</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">{t("주먹의 성질", "BOXER TRAITS")}</h2>
        </div>
        
        <div className="mb-4 flex items-center gap-3 bg-red-600/10 border border-red-600/30 p-3 italic">
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-black uppercase skew-x-[-15deg]">Strong Point</span>
            <span className="text-white font-black text-sm tracking-tighter">
              {agg >= tech && agg >= men && t("압도적인 파괴력의 소유자", "Overwhelming Destructive Power")}
              {tech > agg && tech >= men && t("정교한 기술의 테크니션", "Precision Technician")}
              {men > agg && men > tech && t("꺾이지 않는 강철 멘탈", "Unbreakable Iron Mental")}
            </span>
        </div>

        <div className="space-y-8 bg-zinc-900/40 p-8 border-y-2 border-red-600/30">
          {[
            { name: t("파괴력 (AGG)", "POWER (AGG)"), value: percentAgg, color: "from-red-600 to-orange-500", labelColor: "text-orange-500" },
            { name: t("기술력 (TECH)", "SKILL (TECH)"), value: percentTech, color: "from-blue-600 to-cyan-400", labelColor: "text-blue-400" },
            { name: t("정신력 (MEN)", "MENTAL (MEN)"), value: percentMen, color: "from-zinc-400 to-white", labelColor: "text-zinc-300" }
          ].map((stat, i) => (
            <div key={i} className="group/stat">
              <div className="flex justify-between items-end mb-3">
                <span className="font-black text-sm italic tracking-widest text-white/70 group-hover/stat:text-white transition-colors">{stat.name}</span>
                <span className={`font-title text-2xl italic leading-none ${stat.labelColor}`}>{stat.value}%</span>
              </div>
              <div className="w-full h-4 bg-black border border-white/10 p-[2px] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${stat.value}%` }} transition={{ duration: 1.2 }} className={`h-full bg-gradient-to-r ${stat.color} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 압천의 일침 */}
      <section className="w-full max-w-md mb-24 flex flex-col items-center">
        <div className="flex items-baseline gap-2 mb-6 w-full">
          <span className="font-title text-red-600 text-sm italic font-black">{t("제2보", "STEP 2")}</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">{t("압천의 일침", "COACH'S WORDS")}</h2>
        </div>
        <div className="w-full flex flex-col items-center group">
          <img src="/images/characters/coach_2.png" className="w-full h-auto object-contain z-10 mb-[-20px]" alt="coach" />
          <div className="bg-white text-black p-6 sm:p-8 rounded-sm border-4 border-black shadow-[10px_10px_0_rgba(220,38,38,0.5)] z-20 w-full relative">
            <p className="font-dialogue text-xl sm:text-2xl font-black italic leading-tight mb-4 break-keep">
              {getField('coach_comment')}
            </p>
            <p className="text-sm sm:text-base font-bold text-zinc-600 leading-relaxed border-t-2 border-black/5 pt-4 break-keep">
              {getField('coach_analysis')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. 필살기 및 상성 */}
      <section className="w-full max-w-md mb-24">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black">{t("제3보", "STEP 3")}</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">{t("전율의 피니쉬", "FINISHING BLOW")}</h2>
        </div>
        <div className="bg-red-600 p-1">
          <div className="bg-black p-8 border-2 border-white/20 text-center">
            <h3 className="font-title text-4xl text-red-500 mb-4 italic tracking-tighter">
              <SafeItalicTitle className="">{character.signature_move}</SafeItalicTitle>
            </h3>
            <p className="text-white/80 text-sm leading-relaxed font-bold break-keep">
              {getField('move_description')}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-md mb-24 space-y-4">
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-title text-red-600 text-sm italic font-black">{t("최종보", "FINAL")}</span>
          <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">{t("숙명의 인연", "DESTINED BONDS")}</h2>
        </div>
        {bestMatch && (
          <div className="bg-blue-900/10 border-l-4 border-blue-500 p-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 bg-zinc-800 overflow-hidden shrink-0">
               <img src={`/images/characters/char_${String(bestMatch.id).padStart(2,"0")}.png`} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-[10px] text-blue-400 font-black tracking-widest uppercase mb-1">Best Partner</p>
              <p className="font-black text-xl italic">{lang === 'ko' ? bestMatch.name_full_kr : bestMatch.name_full_en}</p>
            </div>
          </div>
        )}
        {worstMatch && (
          <div className="bg-red-900/10 border-l-4 border-red-600 p-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-red-600 bg-zinc-800 overflow-hidden shrink-0">
               <img src={`/images/characters/char_${String(worstMatch.id).padStart(2,"0")}.png`} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-[10px] text-red-500 font-black tracking-widest uppercase mb-1">Fatal Rival</p>
              <p className="font-black text-xl italic">{lang === 'ko' ? worstMatch.name_full_kr : worstMatch.name_full_en}</p>
            </div>
          </div>
        )}
      </section>
      {/* --- 유튜브 섹션: 포인링의 실전 + 준코너의 기본기 --- */}
      <section className="w-full max-w-md mb-24 space-y-12">
        
        {/* 1. 포인링의 실전 기록 (대회 도전기) */}
        <div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-title text-red-600 text-sm italic font-black uppercase">Extra 01</span>
            <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">
              {t("포인링의 실전 기록", "POINRING'S FIGHT LOG")}
            </h2>
          </div>

          <div className="group relative bg-zinc-900 border-2 border-red-600/30 p-1 rounded-sm transition-all hover:border-red-600">
            <div className="relative pt-[56.25%] w-full bg-black overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/videoseries?list=PLek2QZCNTsZyQQsS8TCiaS_C3_TdcZ1i6" 
                title="Poinring Fight Log"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-black/50">
              <p className="text-xs text-zinc-400 font-bold leading-relaxed break-keep">
                {t(
                  "어쩌다 복싱이 일상이 된 2년. 링 위에서 증명해낸 TKO 우승의 순간들을 담았습니다.",
                  "2 years of boxing as a lifestyle. Capturing the raw moments of victory and the reality of the ring."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 2. 준코너의 기본기 (How to Train) */}
        <div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-title text-blue-500 text-sm italic font-black uppercase">Extra 02</span>
            <h2 className="font-title text-2xl text-white italic tracking-tighter uppercase">
              {t("복싱레터: JUN’S CORNER", "HOW TO TRAIN: BASICS")}
            </h2>
          </div>

          <div className="group relative bg-zinc-900 border-2 border-blue-600/30 p-1 rounded-sm transition-all hover:border-blue-500">
            <div className="relative pt-[56.25%] w-full bg-black overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/videoseries?list=PLek2QZCNTsZxlueVOdkHCBBdudl9DPuSS"
                title="Jun's Corner Training"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-black/50">
              <p className="text-xs text-zinc-400 font-bold leading-relaxed break-keep">
                {t(
                  "단단한 몸과 마음을 만드는 비결. 더 오래, 깊이 있게 복싱을 즐기기 위한 기본기를 나눕니다.",
                  "The secret to a solid mind and body. Sharing the essential basics to enjoy boxing for the long run."
                )}
              </p>
              <a 
                href="https://www.youtube.com/@po.inring"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 text-white font-black text-[10px] tracking-[0.2em] hover:bg-red-600 transition-colors"
              >
                {t("전체 기록 보러가기", "VIEW ALL RECORDS")}
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* 5. CTA 버튼 */}
      <div className="w-full max-w-md mt-10 space-y-4">
        <button onClick={handleShare} className="w-full py-6 bg-red-600 text-white font-title text-3xl italic border-b-8 border-red-900 transition-transform active:translate-y-1 active:border-b-4">
          <SafeItalicTitle className="">{t("결과 공유하기", "SHARE RESULT")}</SafeItalicTitle>
        </button>
        <button onClick={() => router.push("/")} className="w-full py-4 text-white/30 hover:text-white font-black text-xs tracking-[0.3em] uppercase transition-colors">
          {t("BACK TO GYM (다시 도전하기)", "BACK TO GYM (RETRY)")}
        </button>
      </div>
    </main>
  );
}