"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext"; // 컨텍스트 추가

// 언어별 로딩 메시지 사전
const MESSAGES_DICT = {
  ko: [
    "네 놈의 주먹 무게를 측정하는 중...",
    "기술적인 정교함을 분석하고 있다.", 
    "무너지지 않는 멘탈의 소유자인가?",   
    "야생의 본능이 느껴지는구먼...",      
    "관장님이 너를 노려보고 있다..."
  ],
  en: [
    "Measuring the weight of your punches...",
    "Analyzing your technical precision...",
    "Checking your unbreakable spirit...",
    "I can feel your wild instincts...",
    "The Coach is watching you closely..."
  ]
};

export default function ResultLoading() {
  const router = useRouter();
  const { lang, t } = useLang(); // 언어 상태 가져오기
  
  // 현재 언어에 맞는 메시지 리스트 선택
  const currentMessages = MESSAGES_DICT[lang];
  const [currentMsg, setCurrentMsg] = useState(currentMessages[0]);

  useEffect(() => {
    // 1. 메시지 셔플 로직 (현재 언어 리스트 기준)
    const interval = setInterval(() => {
      const randomMsg = currentMessages[Math.floor(Math.random() * currentMessages.length)];
      setCurrentMsg(randomMsg);
    }, 800);

    // 2. URL에서 전달받은 id와 s(점수) 추출
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const s = searchParams.get("s");

    // 3. 결과 페이지로 이동
    const timer = setTimeout(() => {
      if (id && s) {
        router.replace(`/quiz/result/${id}?s=${s}`);
      } else {
        router.replace('/');
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router, currentMessages]); // currentMessages가 바뀌면 인터벌 재설정

  return (
    <main className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* --- 기존 디자인 및 애니메이션 (절대 유지) --- */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_70%)] z-10" />
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      </div>

      <div className="flex flex-col items-center z-20">
        <div className="relative mb-16">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"
          />
          
          <div className="relative flex items-center justify-center">
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

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 font-ui text-[10px] tracking-[0.5em] mb-4 uppercase"
          >
            {t("데이터 분석 중...", "Analyzing your fighting spirit...")}
          </motion.div>
          
          <div className="h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentMsg}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl sm:text-3xl text-center text-white font-dialogue font-bold italic break-keep px-4"
              >
                "{currentMsg}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent"
          />
        </div>

        <div className="mt-6 font-title text-red-600 text-sm tracking-widest animate-pulse italic">
          {t("판정 중...", "JUDGING...")}
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white to-red-600" />
    </main>
  );
}