import { EARTH_GEONAME_ID } from "./constants";
import { GeonameTaxonomy, RegionTaxonomy, SpotTaxonomy, SubregionTaxonomy, Taxonomy, TaxonomyQuery, TaxonomyResponse } from "./types";

const BASE_TAXONOMY_URL = 'https://services.surfline.com/taxonomy';

export async function fetchTaxonomy({id, type = 'taxonomy', maxDepth = 0}: TaxonomyQuery): Promise<TaxonomyResponse> {
  const url = `${BASE_TAXONOMY_URL}?type=${type}&id=${id}&maxDepth=${maxDepth}`;

  const res = await fetch(url);
  return await res.json() as TaxonomyResponse;
}

export async function fetchEarthTaxonomy(maxDepth = 0): Promise<TaxonomyResponse> {
  const earthTaxonomy = await fetchTaxonomy({id: EARTH_GEONAME_ID, maxDepth});

  if (!isGeonameTaxonomy(earthTaxonomy)) {
    throw new Error(`Unexpected taxonomy type in 'fetchEarthTaxonomy': ${earthTaxonomy._id}, ${earthTaxonomy.name}, ${earthTaxonomy.type}`);
  }

  return earthTaxonomy;
}

// Note: this is a pretty large call that returns slowly
export async function fetchAllTaxonomies(): Promise<TaxonomyResponse> {
  // depth:
  // * earth (geoname)
  // * continents (geoname) (eg. north america, asia)
  // * countries (geoname) (eg. mexico, united state)
  // * states (geoname) (eg. california, minnesota)
  // * counties/areas (geoname/subregion) (eg. la county, sd county)
  // * towns/cities (geoname/subregion) (eg. del mar, ocean beach)
  // * spots
  //
  // depth = 5 captures all levels

  return fetchEarthTaxonomy(5);
}

// type refinement helpers
export const isSpotTaxonomy = (t: Taxonomy): t is SpotTaxonomy => t.type === 'spot';
export const isSubregionTaxonomy = (t: Taxonomy): t is SubregionTaxonomy => t.type === 'subregion';
export const isRegionTaxonomy = (t: Taxonomy): t is RegionTaxonomy => t.type === 'region';
export const isGeonameTaxonomy = (t: Taxonomy): t is GeonameTaxonomy => t.type === 'geoname';

export const toTaxonomy = (tx: TaxonomyResponse): Taxonomy => tx;
export const flattenTaxonomyResponse = (tx: TaxonomyResponse): Taxonomy[] => tx.contains.concat(tx.in).concat([toTaxonomy(tx)]);
