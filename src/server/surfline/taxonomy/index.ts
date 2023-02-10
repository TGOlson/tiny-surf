import { isGeonameTaxonomy, TaxonomyResponse } from "./types";

const taxonomyUrl = (id: string, maxDepth = 0) => `https://services.surfline.com/taxonomy?type=taxonomy&id=${id}&maxDepth=${maxDepth}`;

// helpful ids to use when starting a search
export const EARTH_GEONAME_ID = '58f7ed51dadb30820bb38782';
export const SOUTH_AMERICA_GEONAME_ID = "58f7eef5dadb30820bb55cba";
export const NORTH_AMERICA_GEONAME_ID = "58f7ed51dadb30820bb38791";
export const EUROPE_GEONAME_ID = "58f7eef8dadb30820bb5601b";
export const OCEANIA_GEONAME_ID = "58f7eef9dadb30820bb5626e";
export const AFRICA_GEONAME_ID = "58f7f00ddadb30820bb69bbc";
export const ASIA_GEONAME_ID = "58f7eef1dadb30820bb556be";

// for whatever reason Jaluit Atoll (5bdb2e9e1349f51cb0e83182) in Greece references an id in `liesIn` that doesn't exist
export const NONEXISTENT_GREECE_SUBREGION_ID = '5bdb2d7ed43f7a0001c07d01';

export async function fetchTaxonomy(id: string, maxDepth = 0): Promise<TaxonomyResponse> {
  const url = taxonomyUrl(id, maxDepth);

  const res = await fetch(url);
  return await res.json() as TaxonomyResponse;
}

export async function fetchEarthTaxonomy(maxDepth = 0): Promise<TaxonomyResponse> {
  const earthTaxonomy = await fetchTaxonomy(EARTH_GEONAME_ID, maxDepth);

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
