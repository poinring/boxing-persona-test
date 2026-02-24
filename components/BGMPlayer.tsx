'use client';

import React, { useState, useEffect } from 'react';

export default function BGMPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const trackUrl = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/509621919&color=%23ff0000&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false";

  useEffect(() => {
    // 화면 클릭 시 실행될 함수
    const startMusic = () => {
      const iframeElement = document.getElementById('sc-player') as HTMLIFrameElement;
      const windowObj = window as any;
      
      // 사운드클라우드 위젯 API가 로드되었는지 확인 후 재생
      if (iframeElement && windowObj.SC) {
        const widget = windowObj.SC.Widget(iframeElement);
        widget.play();
        console.log("BGM Started by User Click");
        
        // 한 번 재생되면 더 이상 클릭 이벤트를 감시하지 않음
        window.removeEventListener('click', startMusic);
      }
    };

    // 브라우저 전체에 클릭 이벤트 리스너 등록
    window.addEventListener('click', startMusic);

    return () => {
      window.removeEventListener('click', startMusic);
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2">
      <div className={`
        transition-all duration-500 ease-in-out overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.1)] border border-white/20 rounded-full bg-black/90 backdrop-blur-md
        ${isOpen ? 'w-[200px] h-[32px] opacity-100 px-1' : 'w-0 h-0 opacity-0 pointer-events-none'}
      `}>
        <iframe
          id="sc-player"
          width="100%"
          height="20"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={trackUrl}
          className="mt-[6px]"
        />
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation(); // 버튼 클릭 시 startMusic이 중복 실행되지 않게 방지
          setIsOpen(!isOpen);
        }}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-2
          ${isOpen ? 'bg-white border-white rotate-180' : 'bg-[#050505] border-red-600 text-red-600 hover:scale-105'}
        `}
      >
        {isOpen ? (
          <span className="text-[8px] font-black text-black">X</span>
        ) : (
          <div className="relative">
             <span className="text-lg animate-spin-slow inline-block">💿</span>
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
             </span>
          </div>
        )}
      </button>
    </div>
  );
}