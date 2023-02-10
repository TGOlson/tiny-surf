import path from 'path';
import { writeFile, readFile } from 'fs/promises';

import { TaxonomyResponse } from './surfline/taxonomy/types';

async function readJSON<T> (p: string): Promise<T> {
  const res = await readFile(p, 'utf8');
  return JSON.parse(res) as T;
}

const RAW_TAXONOMY_PATH = path.resolve(__dirname, '../data/raw/taxonomy.json');

export async function writeRawTaxonomyData(tx: TaxonomyResponse): Promise<void> {
  return writeFile(RAW_TAXONOMY_PATH, JSON.stringify(tx));
}

export async function readRawTaxonomyData(): Promise<TaxonomyResponse> {
  return readJSON(RAW_TAXONOMY_PATH);
}
