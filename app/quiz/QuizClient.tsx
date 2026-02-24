'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type CsvRecord = Record<string, string>;

interface Choice {
  text: string;
  type: 'agg' | 'tech' | 'men';
}

export default function QuizClient({ 
  questions, 
  characters 
}: { 
  questions: CsvRecord[], 
  characters: any[] 
}) {
  const router = useRouter();

  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Array<string | null>>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const parsedData = questions.map((q, idx) => {
      const rawChoices: Choice[] = [
        { text: q.agg_option ?? '', type: 'agg' },
        { text: q.tech_option ?? '', type: 'tech' },
        { text: q.men_option ?? '', type: 'men' },
      ];
      const shuffledChoices = [...rawChoices].sort(() => Math.random() - 0.5);
      return {
        id: q.id ?? String(idx),
        tag: q.tag_kr ?? 'ROUND',
        text: q.question_kr ?? '',
        choices: shuffledChoices,
      };
    });

    setShuffledQuestions(parsedData);
    setAnswers(Array(parsedData.length).fill(null));
    setIsMounted(true);

    const windowObj = window as any;
    windowObj.dataLayer = windowObj.dataLayer || [];
    windowObj.dataLayer.push({
      event: 'quiz_start',
      total_rounds: parsedData.length
    });
  }, [questions]);

  if (!isMounted || shuffledQuestions.length === 0) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  const current = shuffledQuestions[currentStep];

  const handleSelect = (choice: Choice) => {
    const copy = [...answers];
    copy[currentStep] = choice.type;
    setAnswers(copy);

    const windowObj = window as any;
    windowObj.dataLayer = windowObj.dataLayer || [];
    windowObj.dataLayer.push({
      event: 'quiz_progress',
      round_number: currentStep + 1,
      question_text: current.text,
      answer_text: choice.text,
      answer_type: choice.type
    });

    if (currentStep < shuffledQuestions.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 400);
    }
  };

  const goPrev = () => {
    if (currentStep === 0) router.push('/');
    else setCurrentStep((s) => s - 1);
  };

  /**
   * [업그레이드된 알고리즘]
   * 단순 거리 계산에 '주특기 가중치'를 더해 사용자의 성향이 가장 강한 캐릭터를 매칭합니다.
   */
  const handleSubmit = () => {
    if (answers.every((a) => a !== null)) {
      const score = { agg: 0, tech: 0, men: 0 };
      answers.forEach((type) => {
        if (type === 'agg') score.agg++;
        if (type === 'tech') score.tech++;
        if (type === 'men') score.men++;
      });

      // 1. 사용자의 가장 높은 성향(Dominant Trait) 식별
      const traits = [
        { name: 'agg', val: score.agg },
        { name: 'tech', val: score.tech },
        { name: 'men', val: score.men }
      ];
      const userMainTrait = traits.reduce((prev, curr) => (prev.val >= curr.val) ? prev : curr).name;

      // 2. 가중치 적용 거리 계산 함수
      const getDistance = (c: any) => {
        const cAgg = Number(c.agg) || 0;
        const cTech = Number(c.tech) || 0;
        const cMen = Number(c.men) || 0;

        // 해당 캐릭터의 주성향 찾기
        const cTraits = [
          { name: 'agg', val: cAgg },
          { name: 'tech', val: cTech },
          { name: 'men', val: cMen }
        ];
        const charMainTrait = cTraits.reduce((prev, curr) => (prev.val >= curr.val) ? prev : curr).name;

        // 기본 유클리드 거리 (제곱합)
        const dAgg = Math.pow(cAgg - score.agg, 2);
        const dTech = Math.pow(cTech - score.tech, 2);
        const dMen = Math.pow(cMen - score.men, 2);
        
        let totalDist = Math.sqrt(dAgg + dTech + dMen);

        // [핵심 가중치] 사용자의 주성향과 캐릭터의 주성향이 일치하면 거리를 20% 줄여 우선 매칭
        if (userMainTrait === charMainTrait) {
          totalDist *= 0.8; 
        }

        return totalDist;
      };

      // 3. 최적 매칭 캐릭터 탐색
      let closest = characters[0];
      let minDistance = getDistance(closest);

      characters.forEach((c) => {
        const dist = getDistance(c);
        if (dist < minDistance) {
          closest = c;
          minDistance = dist;
        }
      });

      // 4. 데이터 수집 (기존 로직 유지)
      const windowObj = window as any;
      windowObj.dataLayer = windowObj.dataLayer || [];
      windowObj.dataLayer.push({
        event: 'quiz_finish',
        final_agg: score.agg,
        final_tech: score.tech,
        final_men: score.men,
        matched_character: closest.name_short_kr
      });
      
      // 5. 로딩 페이지로 이동
      const scoreStr = `${score.agg}-${score.tech}-${score.men}`;
      router.push(`/quiz/result/loading?id=${closest.id}&s=${scoreStr}`);
    }
  };

  const progress = ((currentStep + 1) / shuffledQuestions.length) * 100;

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden font-ui">
      {/* 배경 디자인 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <section className="w-full max-w-xl flex flex-col relative z-10">
        <header className="mb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-title text-red-600 text-xl italic tracking-tighter">ROUND</span>
            <span className="font-title text-5xl italic tracking-tighter leading-none">
              {String(currentStep + 1).padStart(2, '0')}
            </span>
            <span className="text-white/20 self-end mb-1 font-bold">/ {shuffledQuestions.length}</span>
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
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div className="relative">
              <span className="absolute -top-6 -left-2 text-red-600/30 font-title text-6xl italic -z-10 uppercase select-none">
                {current.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-keep italic tracking-tighter">
                {current.text}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {current.choices.map((choice: Choice, index: number) => {
                const isSelected = answers[currentStep] === choice.type;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(choice)}
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
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Prev 
          </button>

          {currentStep === shuffledQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!answers.every((a) => a !== null)}
              className="
                bg-red-600 text-white px-10 py-3 font-title text-2xl italic
                shadow-[4px_4px_0_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                disabled:opacity-20 disabled:grayscale transition-all
              "
            >
              FINISH!!
            </button>
          ) : (
            <div className="text-[10px] text-white/20 font-black tracking-widest uppercase italic">
              Keep Pushing, Champ
            </div>
          )}
        </footer>
      </section>
    </main>
  );
}