import { GeonameTaxonomy, isGeonameTaxonomy } from "../../shared/surfline/taxonomy";

const taxonomyUrl = (id: string, maxDepth = 0) => `https://services.surfline.com/taxonomy?type=taxonomy&id=${id}&maxDepth=${maxDepth}`;

const EARTH_GEONAME_ID = '58f7ed51dadb30820bb38782';

export async function fetchEarthGeoname(): Promise<GeonameTaxonomy> {
  const url = taxonomyUrl(EARTH_GEONAME_ID, 1);

  const res = await fetch(url);
  const earthGeoname = await res.json() as GeonameTaxonomy;

  earthGeoname.contains.forEach(geo => {
    if (!isGeonameTaxonomy(geo)) throw new Error(`Unexpected taxonomy type in 'fetchEarthGeoname': ${geo._id}, ${geo.name}, ${geo.type}`);
  });

  return earthGeoname;
}
