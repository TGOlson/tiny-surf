import { isSpotTaxonomy, Taxonomy } from "../shared/surfline/taxonomy";
import { Region } from "../shared/types";


// url for south SD, just hardcoded for testing
export const SOUTH_SD_REGION_ID = '58f7ed68dadb30820bb3a1a7';
export const CALIFORNIA_GEONAME_ID = '58f7ed51dadb30820bb387a6';


// use example data for local testing, for now...
// const regionUrl = (id: string) => `https://services.surfline.com/taxonomy?type=taxonomy&id=${id}`;
const regionUrl = (id: string) => `/api/taxonomy_${id}.json`;

const taxonomyToRegion = (taxonomy: Taxonomy): Region => {
  if (taxonomy.type !== 'subregion') throw new Error(`Unexpected taxonomy type: ${taxonomy.type}`);

  const id = taxonomy._id;
  const name = taxonomy.name;

  const spots = taxonomy.contains
    .filter(isSpotTaxonomy)
    .sort((a, b) => b.location.coordinates[1] - a.location.coordinates[1]) // sorted north to south
    .map(({_id, name}) => ({id: _id, name}));

  return {id, name, spots};
};

export const fetchRegion = (id: string): Promise<Region> => {
  return fetch(regionUrl(id))
    .then(res => res.json() as Promise<Taxonomy>)
    .then(taxonomy => taxonomyToRegion(taxonomy));
};
