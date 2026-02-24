'use client';

import React, { useState, useEffect } from 'react'; // useMemo 제거
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type CsvRecord = Record<string, string>;

interface Choice {
  text: string;
  type: 'agg' | 'tech' | 'men';
}

export default function QuizClient({ questions }: { questions: CsvRecord[] }) {
  const router = useRouter();

  // [수정] 하이드레이션 오류 방지를 위해 상태로 관리
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Array<string | null>>([]);
  const [isMounted, setIsMounted] = useState(false); // 마운트 상태 확인용

  // [수정 및 수집 1] 마운트 시점에 데이터 파싱 및 셔플 진행
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    // 브라우저 환경에서만 셔플을 진행하여 서버와 일치시킴
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
    setIsMounted(true); // 이제 클라이언트 렌더링 준비 완료

    // 데이터 영역에 시작 이벤트 전송
    const windowObj = window as any;
    windowObj.dataLayer = windowObj.dataLayer || [];
    windowObj.dataLayer.push({
      event: 'quiz_start',
      total_rounds: parsedData.length
    });
  }, [questions]);

  // 마운트되기 전에는 서버의 정적 결과와 충돌하지 않도록 빈 화면 반환
  if (!isMounted || shuffledQuestions.length === 0) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  const current = shuffledQuestions[currentStep];

  // [수집 2] 선택지를 누를 때마다 데이터 전송 (기존 로직 유지)
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

  // [수집 3] 마지막 제출 버튼 누를 때 알림 (기존 로직 유지)
  const handleSubmit = () => {
    if (answers.every((a) => a !== null)) {
      const score = { agg: 0, tech: 0, men: 0 };
      answers.forEach((type) => {
        if (type === 'agg') score.agg++;
        if (type === 'tech') score.tech++;
        if (type === 'men') score.men++;
      });

      const windowObj = window as any;
      windowObj.dataLayer = windowObj.dataLayer || [];
      windowObj.dataLayer.push({
        event: 'quiz_finish',
        final_agg: score.agg,
        final_tech: score.tech,
        final_men: score.men
      });
      
      const scoreStr = encodeURIComponent(JSON.stringify(score));
      router.push(`/quiz/result/loading?score=${scoreStr}`);
    }
  };

  const progress = ((currentStep + 1) / shuffledQuestions.length) * 100;

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
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