import path from 'path';
import { writeFile, readFile } from 'fs/promises';

import { Taxonomy } from 'surfline/taxonomy/types';
import { Spot } from '../shared/types';

export async function readJSON<T> (p: string): Promise<T> {
  const res = await readFile(p, 'utf8');
  return JSON.parse(res) as T;
}

const EARTH_TAXONOMY_PATH = path.resolve(__dirname, '../data/raw/taxonomy_earth.json');
const ADDITIONAL_TAXONOMY_PATH = path.resolve(__dirname, '../data/raw/taxonomy_additional.json');
const ALL_TAXONOMY_PATH = path.resolve(__dirname, '../data/raw/taxonomy_all.json');

const PARSED_SPOTS_PATH = path.resolve(__dirname, '../data/parsed/spots.json');
const PARSED_CA_SPOTS_PATH = path.resolve(__dirname, '../data/parsed/ca_spots.json');

type JSONReader<T> = () => Promise<T>;
type JSONWriter<T> = (x: T) => Promise<void>;

type JSONStorage<T> = {
  read: JSONReader<T>,
  write: JSONWriter<T>,
};

function makeJSONStorage<T>(p: string): JSONStorage<T> {
  return {
    read: () => readJSON(p), 
    write: (x: T) => writeFile(p, JSON.stringify(x))
  };
}

export const earthTaxonomy: JSONStorage<Taxonomy[]> = makeJSONStorage(EARTH_TAXONOMY_PATH);
export const additionalTaxonomy: JSONStorage<Taxonomy[]> = makeJSONStorage(ADDITIONAL_TAXONOMY_PATH);
export const allTaxonomy: JSONStorage<Taxonomy[]> = makeJSONStorage(ALL_TAXONOMY_PATH);

export const parsedSpots: JSONStorage<Spot[]> = makeJSONStorage(PARSED_SPOTS_PATH);
export const parsedCASpots: JSONStorage<Spot[]> = makeJSONStorage(PARSED_CA_SPOTS_PATH);
