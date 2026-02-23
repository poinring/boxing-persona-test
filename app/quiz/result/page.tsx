import loadData from "../../../lib/data";
import ResultClient from "./ResultClient";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ answers?: string }>;
}) {
  // 🔥 searchParams는 Promise이므로 await 해야 함
  const params = await searchParams;
  
  const data = await loadData();
  const { questions, characters } = data;

  let answers: number[] = [];

  if (params?.answers) {
    try {
      answers = JSON.parse(
        decodeURIComponent(params.answers)
      ).map(Number);
    } catch (e) {
      console.error("answers 파싱 오류:", e);
      answers = [];
    }
  }
  
  console.log("[ResultPage] 최종 answers:", answers);

  return (
    <ResultClient
      questions={questions}
      characters={characters}
      answers={answers}
    />
  );
}