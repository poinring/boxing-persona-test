import { Metadata } from 'next';
import { headers } from 'next/headers'; // 브라우저 언어 확인용
import ResultClient from './ResultClient';
import loadData from '@/lib/data';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s: string; lang?: string }>; // URL에 lang이 있을 경우 대비
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { lang: queryLang } = await searchParams;
  
  // 1. 언어 판별 로직
  // URL에 ?lang=en이 있거나, 브라우저 헤더가 한국어가 아니면 영문으로 표시
  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language') || "";
  const isEn = queryLang === 'en' || (!acceptLanguage.includes('ko') && !queryLang);

  const data = await loadData();
  const character = data.characters.find((c: any) => String(c.id) === String(id));
  
  if (!character) return { title: "결과 확인 | Boxing Test" };

  // 2. 언어별 텍스트 설정
  const title = isEn 
    ? `${character.name_full_en} | Hajime No Ippo Test`
    : `${character.name_full_kr} | 더파이팅 복싱 성향 테스트`;
    
  const description = isEn ? character.summary_en : character.summary_kr;
  
  const ogTitle = isEn
    ? `[Result] My punch is '${character.name_short_en}' level!`
    : `[판정] 내 주먹은 '${character.name_short_kr}'급! 필살기는 '${character.signature_move}'`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: isEn ? character.quote_en : character.quote_kr,
      images: [`/images/characters/char_${String(character.id).padStart(2, "0")}.png`],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
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