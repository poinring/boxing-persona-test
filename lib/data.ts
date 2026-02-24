import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

export type CsvRecord = Record<string, any>; // dynamicTyping을 위해 any로 유연하게 변경

async function readCSV(filePath: string): Promise<CsvRecord[]> {
  const csv = await fs.readFile(filePath, 'utf8');
  const parsed = Papa.parse<CsvRecord>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // 숫자를 문자열이 아닌 실제 숫자로 인식하게 함
  });
  
  if (parsed.errors && parsed.errors.length) {
    console.warn(`papaparse errors for ${filePath}:`, parsed.errors);
  }
  return parsed.data;
}

/**
 * 프로젝트의 CSV 데이터를 로드합니다.
 */
export async function loadData() {
  const base = process.cwd();
  const charactersPath = path.join(base, 'characters.csv');
  const questionsPath = path.join(base, 'questions.csv');

  const [characters, questions] = await Promise.all([
    readCSV(charactersPath),
    readCSV(questionsPath),
  ]);

  return {
    characters,
    questions,
  };
}

export default loadData;