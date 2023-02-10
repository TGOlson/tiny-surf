import { GeonameTaxonomy, isGeonameTaxonomy } from "../../shared/surfline/taxonomy";

const taxonomyUrl = (id: string, maxDepth = 0) => `https://services.surfline.com/taxonomy?type=taxonomy&id=${id}&maxDepth=${maxDepth}`;

const EARTH_GEONAME_ID = '58f7ed51dadb30820bb38782';
// const SOUTH_AMERICA_GEONAME_ID = "58f7eef5dadb30820bb55cba";
// const NORTH_AMERICA_GEONAME_ID = "58f7ed51dadb30820bb38791";
// const EUROPE_GEONAME_ID = "58f7eef8dadb30820bb5601b";
// const OCEANIA_GEONAME_ID = "58f7eef9dadb30820bb5626e";
// const AFRICA_GEONAME_ID = "58f7f00ddadb30820bb69bbc";
// const ASIA_GEONAME_ID = "58f7eef1dadb30820bb556be";

// depth:
// * earth (geoname)
// * continents (geoname) (eg. north america, asia)
// * countries (geoname) (eg. mexico, united state)
// * states (geoname) (eg. california, minnesota)
// * counties/areas (geoname/subregion) (eg. la county, sd county)
// * towns/cities (geoname/subregion) (eg. del mar, ocean beach)
// * spots

export async function fetchEarthGeoname(maxDepth = 0): Promise<GeonameTaxonomy> {
  const url = taxonomyUrl(EARTH_GEONAME_ID, maxDepth);

  const res = await fetch(url);
  const earthGeoname = await res.json() as GeonameTaxonomy;

  earthGeoname.contains.forEach(geo => {
    if (!isGeonameTaxonomy(geo)) throw new Error(`Unexpected taxonomy type in 'fetchEarthGeoname': ${geo._id}, ${geo.name}, ${geo.type}`);
  });

  return earthGeoname;
}

export async function fetchAll(): Promise<GeonameTaxonomy> {
  return fetchEarthGeoname(5);
}
