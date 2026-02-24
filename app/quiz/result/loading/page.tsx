"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LOADING_MESSAGES = [
  "네 놈의 주먹 무게를 측정하는 중...",
  "기술적인 정교함을 분석하고 있다.", // Tech 테마
  "무너지지 않는 멘탈의 소유자인가?",   // Men 테마
  "야생의 본능이 느껴지는구먼...",      // Agg 테마
  "관장님이 너를 노려보고 있다..."
];

export default function ResultLoading() {
  const router = useRouter();
  const [currentMsg, setCurrentMsg] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    // 메시지 셔플
    const interval = setInterval(() => {
      const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      setCurrentMsg(randomMsg);
    }, 800);

    // 결과 페이지로 이동
    const search = window.location.search;
    const timer = setTimeout(() => {
      router.replace(`/quiz/result${search}`);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* BACKGROUND DECOR: 만화적 속도선 효과 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_70%)] z-10" />
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      </div>

      <div className="flex flex-col items-center z-20">
        
        {/* ANIMATION: 샌드백 타격 연출 */}
        <div className="relative mb-16">
          {/* 타격 이펙트 (뒤쪽 불꽃) */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"
          />
          
          <div className="relative flex items-center justify-center">
             {/* 샌드백 아이콘 대용: 복싱 글러브 혹은 강렬한 원형 */}
            <motion.div
              animate={{ 
                x: [-2, 2, -2, 2, 0],
                rotate: [-1, 1, -1, 1, 0]
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="w-24 h-24 border-4 border-white rounded-full flex items-center justify-center bg-black shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <span className="font-title text-4xl text-red-600 italic">HIT</span>
            </motion.div>

            {/* 사방으로 튀는 불꽃선 (만화적 연출) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <motion.div
                key={i}
                animate={{ scaleX: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                style={{ rotate: `${deg}deg`, originX: "left" }}
                className="absolute left-1/2 w-12 h-[2px] bg-gradient-to-r from-white to-transparent"
              />
            ))}
          </div>
        </div>

        {/* LOADING TEXT: 서사적 문구 */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 font-ui text-[10px] tracking-[0.5em] mb-4 uppercase"
          >
            Analyzing your fighting spirit...
          </motion.div>
          
          <div className="h-20 flex items-center justify-center">
            <motion.p 
              key={currentMsg}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl sm:text-3xl text-center text-white font-dialogue font-bold italic break-keep px-4"
            >
              "{currentMsg}"
            </motion.p>
          </div>
        </div>

        {/* PROGRESS BAR: 링 로프 스타일 */}
        <div className="mt-12 w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent"
          />
        </div>

        <div className="mt-6 font-title text-red-600 text-sm tracking-widest animate-pulse italic">
          JUDGING...
        </div>

      </div>

      {/* FOOTER: 만화적 하단 바 */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white to-red-600" />
    </main>
  );
}