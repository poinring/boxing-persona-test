'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LanguageContext'; // 언어 컨텍스트 임포트

type CsvRecord = Record<string, any>;

interface Choice {
  type: 'agg' | 'tech' | 'men';
  // 텍스트는 렌더링 시점에 결정하므로 인터페이스에서 제외하거나 동적으로 처리
}

export default function QuizClient({ 
  questions, 
  characters 
}: { 
  questions: CsvRecord[], 
  characters: any[] 
}) {
  const router = useRouter();
  const { lang, t } = useLang(); // 언어 상태 가져오기

  // 질문 데이터 구조화 (언어와 상관없는 고유 ID와 선택지 순서 유지)
  const [quizData, setQuizData] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Array<string | null>>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. 초기 데이터 설정 (질문 순서와 선택지 셔플은 최초 1회만 실행)
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const parsed = questions.map((q, idx) => {
      // 선택지 타입 순서만 셔플 (텍스트는 렌더링 시점에 lang에 맞춰 가져옴)
      const types: Array<'agg' | 'tech' | 'men'> = ['agg', 'tech', 'men'];
      const shuffledTypes = types.sort(() => Math.random() - 0.5);

      return {
        id: q.id ?? String(idx),
        originalData: q, // 원본 CSV 레코드 보관
        shuffledTypes: shuffledTypes,
      };
    });

    setQuizData(parsed);
    setAnswers(Array(parsed.length).fill(null));
    setIsMounted(true);

    // GTM 이벤트
    const windowObj = window as any;
    windowObj.dataLayer = windowObj.dataLayer || [];
    windowObj.dataLayer.push({
      event: 'quiz_start',
      total_rounds: parsed.length
    });
  }, [questions]);

  if (!isMounted || quizData.length === 0) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  // 2. 현재 단계의 질문 데이터 가공 (현재 언어 반영)
  const currentRaw = quizData[currentStep];
  const currentQuestion = {
    tag: lang === 'ko' ? currentRaw.originalData.tag_kr : currentRaw.originalData.tag_en,
    text: lang === 'ko' ? currentRaw.originalData.question_kr : currentRaw.originalData.question_en,
    choices: currentRaw.shuffledTypes.map((type: string) => {
      // 컬럼명 동적 생성 (예: agg_option 또는 agg_option_en)
      const columnKey = lang === 'ko' ? `${type}_option` : `${type}_option_en`;
      return {
        type: type,
        text: currentRaw.originalData[columnKey] || ''
      };
    })
  };

  const handleSelect = (choiceType: string, choiceText: string) => {
    const copy = [...answers];
    copy[currentStep] = choiceType;
    setAnswers(copy);

    // GTM 프로그레스
    const windowObj = window as any;
    windowObj.dataLayer = windowObj.dataLayer || [];
    windowObj.dataLayer.push({
      event: 'quiz_progress',
      round_number: currentStep + 1,
      question_text: currentQuestion.text,
      answer_text: choiceText,
      answer_type: choiceType
    });

    if (currentStep < quizData.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 400);
    }
  };

  const goPrev = () => {
    if (currentStep === 0) router.push('/');
    else setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (answers.every((a) => a !== null)) {
      const score = { agg: 0, tech: 0, men: 0 };
      answers.forEach((type) => {
        if (type === 'agg') score.agg++;
        if (type === 'tech') score.tech++;
        if (type === 'men') score.men++;
      });

      // 알고리즘: 주성향 가중치 적용 (기존 유지)
      const traits = [
        { name: 'agg', val: score.agg },
        { name: 'tech', val: score.tech },
        { name: 'men', val: score.men }
      ];
      const userMainTrait = traits.reduce((prev, curr) => (prev.val >= curr.val) ? prev : curr).name;

      const getDistance = (c: any) => {
        const cAgg = Number(c.agg) || 0;
        const cTech = Number(c.tech) || 0;
        const cMen = Number(c.men) || 0;
        const cTraits = [{ name: 'agg', val: cAgg }, { name: 'tech', val: cTech }, { name: 'men', val: cMen }];
        const charMainTrait = cTraits.reduce((prev, curr) => (prev.val >= curr.val) ? prev : curr).name;

        const dAgg = Math.pow(cAgg - score.agg, 2);
        const dTech = Math.pow(cTech - score.tech, 2);
        const dMen = Math.pow(cMen - score.men, 2);
        let totalDist = Math.sqrt(dAgg + dTech + dMen);
        if (userMainTrait === charMainTrait) totalDist *= 0.8; 
        return totalDist;
      };

      let closest = characters[0];
      let minDistance = getDistance(closest);
      characters.forEach((c) => {
        const dist = getDistance(c);
        if (dist < minDistance) { closest = c; minDistance = dist; }
      });

      // 데이터 수집
      const windowObj = window as any;
      windowObj.dataLayer = windowObj.dataLayer || [];
      windowObj.dataLayer.push({
        event: 'quiz_finish',
        final_agg: score.agg,
        final_tech: score.tech,
        final_men: score.men,
        matched_character: closest.name_short_kr
      });
      
      const scoreStr = `${score.agg}-${score.tech}-${score.men}`;
      // 결과 페이지로 이동 (언어 설정은 전역 Context가 관리하므로 굳이 쿼리에 안 붙여도 되지만 안전상 유지 가능)
      router.push(`/quiz/result/loading?id=${closest.id}&s=${scoreStr}`);
    }
  };

  const progress = ((currentStep + 1) / quizData.length) * 100;

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden font-ui">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <section className="w-full max-w-xl flex flex-col relative z-10">
        <header className="mb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-title text-red-600 text-xl italic tracking-tighter uppercase">{t("ROUND", "ROUND")}</span>
            <span className="font-title text-5xl italic tracking-tighter leading-none">
              {String(currentStep + 1).padStart(2, '0')}
            </span>
            <span className="text-white/20 self-end mb-1 font-bold">/ {quizData.length}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-white rounded-full"
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${lang}`} // 언어 변경 시에도 자연스러운 전환 효과
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div className="relative">
              <span className="absolute -top-6 -left-2 text-red-600/30 font-title text-6xl italic -z-10 uppercase select-none">
                {currentQuestion.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-keep italic tracking-tighter">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {currentQuestion.choices.map((choice: any, index: number) => {
                const isSelected = answers[currentStep] === choice.type;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(choice.type, choice.text)}
                    className={`
                      relative group text-left px-6 py-5 sm:py-6 rounded-sm
                      border-2 transition-all duration-200 overflow-hidden
                      ${isSelected 
                        ? 'bg-white text-black border-white translate-x-2' 
                        : 'bg-transparent border-white/20 hover:border-red-600 hover:bg-red-600/5'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span className={`text-lg sm:text-xl font-bold tracking-tight ${isSelected ? 'text-black' : 'text-white'}`}>
                        {choice.text}
                      </span>
                      {isSelected && (
                        <motion.span layoutId="check" className="text-black font-black italic">HIT!</motion.span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-red-600 translate-x-[-100%] group-hover:translate-x-[-95%] transition-transform duration-300 opacity-20" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="mt-16 flex justify-between items-center border-t border-white/10 pt-8">
          <button 
            onClick={goPrev}
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors font-ui text-sm uppercase tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("이전", "Prev")}
          </button>

          {currentStep === quizData.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!answers.every((a) => a !== null)}
              className="
                bg-red-600 text-white px-10 py-3 font-title text-2xl italic
                shadow-[4px_4px_0_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                disabled:opacity-20 disabled:grayscale transition-all
              "
            >
              {t("결과보기!!", "FINISH!!")}
            </button>
          ) : (
            <div className="text-[10px] text-white/20 font-black tracking-widest uppercase italic">
              {t("끝까지 가라, 챔프", "Keep Pushing, Champ")}
            </div>
          )}
        </footer>
      </section>
    </main>
  );
}