import React from 'react';
import QuizClient from './QuizClient';
import loadData from '../../lib/data';

export default async function QuizPage() {
  const data = await loadData();
  const questions = data.questions ?? [];

  return (
    <main className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <QuizClient questions={questions} />
      </div>
    </main>
  );
}
