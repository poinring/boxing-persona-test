'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function BGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const widgetRef = useRef<any>(null);

  const trackUrl = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/509621919&color=%23ff0000&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false";

  useEffect(() => {
    const iframeElement = document.getElementById('sc-player-hidden') as HTMLIFrameElement;
    const windowObj = window as any;

    const initWidget = () => {
      if (iframeElement && windowObj.SC) {
        const widget = windowObj.SC.Widget(iframeElement);
        widgetRef.current = widget;

        // 상태 실시간 감지
        widget.bind(windowObj.SC.Widget.Events.PLAY, () => setIsPlaying(true));
        widget.bind(windowObj.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
        widget.bind(windowObj.SC.Widget.Events.FINISH, () => setIsPlaying(false));

        // 최초 1회 재생을 위한 전역 클릭 리스너 등록
        widget.bind(windowObj.SC.Widget.Events.READY, () => {
          window.addEventListener('click', handleFirstInteraction);
        });
      }
    };

    const handleFirstInteraction = () => {
      if (widgetRef.current) {
        widgetRef.current.play();
        window.removeEventListener('click', handleFirstInteraction);
      }
    };

    // 스크립트 체크 및 초기화
    if (windowObj.SC) {
      initWidget();
    } else {
      const timer = setInterval(() => {
        if (windowObj.SC) {
          initWidget();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }

    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!widgetRef.current) return;
    
    if (isPlaying) {
      widgetRef.current.pause();
    } else {
      widgetRef.current.play();
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[9999]">
      {/* 1. 실제 작동하지만 눈에는 안 보이는 위젯 */}
      <div className="hidden">
        <iframe
          id="sc-player-hidden"
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={trackUrl}
        />
      </div>

      {/* 2. 메인 컨트롤 버튼 (단 하나!) */}
      <button
        onClick={togglePlay}
        className={`
          w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
          border backdrop-blur-md hover:scale-110 active:scale-95
          ${isPlaying 
            ? 'bg-red-500/10 border-red-500/50 ring-2 ring-red-500/20' 
            : 'bg-black/60 border-white/20 hover:bg-black/80'} 
        `}
      >
        <div className="flex items-center justify-center pointer-events-none">
          {isPlaying ? (
            /* [재생 중] 미니멀한 이퀄라이저 애니메이션 */
            <div className="flex items-end gap-[1.5px] h-3">
              {[1, 2, 3].map((i) => (
                <span 
                  key={i}
                  className="w-[2px] bg-red-500 rounded-full animate-music-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            /* [정지 중] 아주 심플하고 작은 음표 */
            <svg 
              viewBox="0 0 24 24" 
              className="w-4 h-4 fill-white/60" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </div>
      </button>

      <style jsx global>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        .animate-music-bar {
          animation: music-bar 0.7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}