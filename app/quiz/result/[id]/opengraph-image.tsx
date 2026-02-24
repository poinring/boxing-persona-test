import { ImageResponse } from 'next/og';
import loadData from '@/lib/data';

export const alt = '복싱 성향 테스트 결과';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const data = await loadData();
  const character = data.characters.find((c: any) => String(c.id) === String(params.id));

  if (!character) return new ImageResponse(<div>Loading...</div>);

  // 캐릭터 이미지의 절대 경로 (public 폴더 기준)
  const characterImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://boxing-persona-test.vercel.app'}/images/characters/char_${String(character.id).padStart(2, "0")}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #050505, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 속도선 효과 (선택사항) */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, display: 'flex' }}>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        {/* 캐릭터 이미지: 크롭되지 않게 objectFit: contain 처리 */}
        <img
          src={characterImageUrl}
          alt={character.name_short_kr}
          style={{
            height: '90%', // 세로를 90%로 맞춰서 위아래 여백 확보
            objectFit: 'contain',
          }}
        />

        {/* 하단 텍스트 레이블 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span style={{ color: '#dc2626', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic' }}>FINAL ANALYSIS</span>
          <span style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>{character.name_full_kr}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}