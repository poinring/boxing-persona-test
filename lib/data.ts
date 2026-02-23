import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

export type CsvRecord = Record<string, string>;

async function readCSV(filePath: string): Promise<CsvRecord[]> {
  const csv = await fs.readFile(filePath, 'utf8');
  const parsed = Papa.parse<CsvRecord>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors && parsed.errors.length) {
    console.warn(`papaparse errors for ${filePath}:`, parsed.errors);
  }
  return parsed.data;
}

/**
 * Load project CSV data.
 *
 * This file lives inside the Next.js project (`boxing-persona-test`).
 * `process.cwd()` is used as the project root so paths resolve correctly
 * when running the dev server or building.
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
