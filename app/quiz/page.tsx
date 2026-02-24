import React from 'react';
import QuizClient from './QuizClient';
import loadData from '../../lib/data'; // 데이터를 불러오는 경로 확인 필수

export default async function QuizPage() {
  const data = await loadData();
  
  // 데이터에서 질문과 캐릭터 정보를 모두 추출합니다.
  const questions = data.questions ?? [];
  const characters = data.characters ?? []; // 캐릭터 데이터 추가

  return (
    // 디자인 유지를 위해 기존 클래스명을 그대로 사용합니다.
    <main className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* [수정] QuizClient에 캐릭터 데이터를 props로 넘겨줍니다. */}
        <QuizClient questions={questions} characters={characters} />
      </div>
    </main>
  );
}