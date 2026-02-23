'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type CsvRecord = Record<string, string>;

export default function QuizClient({ questions }: { questions: CsvRecord[] }) {
  const router = useRouter();

  const parsed = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    return questions.map((q, idx) => ({
      id: q.id ?? String(idx),
      tag: q.tag_kr ?? 'SCENE',
      text: q.question_kr ?? '',
      choices: [q.option_a_kr ?? '', q.option_b_kr ?? ''],
    }));
  }, [questions]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);

  useEffect(() => {
    if (parsed.length > 0) {
      setAnswers(Array(parsed.length).fill(null));
      setCurrentStep(0);
    }
  }, [parsed.length]);

  const current = parsed[currentStep];

  if (!parsed.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white font-ui">
        <p className="text-white/60">문항을 불러오지 못했습니다.</p>
        <Link href="/" className="mt-4 px-6 py-2 bg-red-600 font-title italic">BACK TO GYM</Link>
      </div>
    );
  }

  if (!current) return <div className="min-h-screen bg-[#050505]" />;

  const handleSelect = (choiceIndex: number) => {
    const copy = [...answers];
    copy[currentStep] = choiceIndex;
    setAnswers(copy);

    if (currentStep < parsed.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    }
  };

  const goPrev = () => {
    if (currentStep === 0) router.push('/');
    else setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (answers.every((a) => a !== null)) {
      const answerStr = encodeURIComponent(JSON.stringify(answers));
      router.push(`/quiz/result/loading?answers=${answerStr}`);
    }
  };

  const progress = ((currentStep + 1) / parsed.length) * 100;

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      
      {/* BACKGROUND DECOR: 만화적 질감 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <section className="w-full max-w-xl flex flex-col relative z-10">
        
        {/* PROGRESS HEADER: 라운드 표시 */}
        <header className="mb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-title text-red-600 text-xl italic tracking-tighter">ROUND</span>
            <span className="font-title text-5xl italic tracking-tighter leading-none">
              {String(currentStep + 1).padStart(2, '0')}
            </span>
            <span className="text-white/20 self-end mb-1 font-bold">/ {parsed.length}</span>
          </div>
          
          {/* 게이지 바 */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-white rounded-full"
            />
          </div>
        </header>

        {/* 메인 퀴즈 카드 영역 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            {/* 질문: 만화적 엣지 적용 */}
            <div className="relative">
              <span className="absolute -top-6 -left-2 text-red-600/30 font-title text-6xl italic -z-10 uppercase select-none">
                {current.tag || 'ACTION'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-keep italic tracking-tighter">
                {current.text}
              </h2>
            </div>

            {/* 선택지: 펀치를 날리는 듯한 버튼 스타일 */}
            <div className="flex flex-col gap-4">
              {current.choices.map((choice, index) => {
                const isSelected = answers[currentStep] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
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
                        {choice}
                      </span>
                      {isSelected && (
                        <motion.span layoutId="check" className="text-black font-black italic">HIT!</motion.span>
                      )}
                    </div>
                    {/* 호버 시 붉은 실루엣 효과 */}
                    <div className="absolute inset-0 bg-red-600 translate-x-[-100%] group-hover:translate-x-[-95%] transition-transform duration-300 opacity-20" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 내비게이션: 링 사이드 조작 */}
        <footer className="mt-16 flex justify-between items-center border-t border-white/10 pt-8">
          <button 
            onClick={goPrev}
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors font-ui text-sm uppercase tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Prev 
          </button>

          {currentStep === parsed.length - 1 ? (
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
            <div className="text-[10px] text-white/20 font-black tracking-widest uppercase">
              Keep Fighting
            </div>
          )}
        </footer>

      </section>

    </main>
  );
}