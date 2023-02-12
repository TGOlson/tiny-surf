import { EARTH_GEONAME_ID } from "./constants";
import { Taxonomy, TaxonomyQuery, TaxonomyResponse } from "./types";

const BASE_TAXONOMY_URL = 'https://services.surfline.com/taxonomy';

export async function fetchTaxonomy(q: TaxonomyQuery): Promise<TaxonomyResponse> {
  const type = q.type ?? 'taxonomy';
  const maxDepth = q.maxDepth ?? 0;

  const url = `${BASE_TAXONOMY_URL}?type=${type}&id=${q.id}&maxDepth=${maxDepth}`;

  const res = await fetch(url);
  return await res.json() as TaxonomyResponse;
}

export async function fetchEarthTaxonomy(q: Pick<TaxonomyQuery, 'maxDepth'>): Promise<TaxonomyResponse> {
  return fetchTaxonomy({id: EARTH_GEONAME_ID, maxDepth: q.maxDepth});
}

export const toTaxonomy = (tx: TaxonomyResponse): Taxonomy => {
  const newTx: Taxonomy = {...tx};

  if ('in' in newTx) newTx.in = undefined;
  if ('contains' in newTx) newTx.contains = undefined;

  return newTx;
};

export const flattenTaxonomyResponse = (tx: TaxonomyResponse): Taxonomy[] => tx.contains.concat(tx.in).concat([toTaxonomy(tx)]);
