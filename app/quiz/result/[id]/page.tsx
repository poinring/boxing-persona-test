import { Metadata } from 'next';
import ResultClient from './ResultClient';
import loadData from '@/lib/data';

type Props = {
  params: Promise<{ id: string }>; // [수정] 최신 Next.js 규격에 맞게 Promise 처리
  searchParams: Promise<{ s: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; // await 추가
  const data = await loadData();
  const character = data.characters.find((c: any) => String(c.id) === String(id));
  
  if (!character) return { title: "결과 확인 | 복싱 성향 테스트" };

  return {
    title: `${character.name_full_kr} | 더파이팅 복싱 성향 테스트`,
    description: character.summary_kr,
    openGraph: {
      title: `[판정] 내 주먹은 '${character.name_short_kr}'급! 필살기는 '${character.signature_move}'`,
      description: character.quote_kr
      //images: [`/images/characters/char_${String(character.id).padStart(2, "0")}.png`],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  // [핵심] params와 searchParams를 확실히 기다린(await) 후 넘겨줍니다.
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await loadData();
  
  return (
    <ResultClient 
      id={resolvedParams.id} 
      scoreStr={resolvedSearchParams.s} 
      characters={data.characters || []} 
    />
  );
}