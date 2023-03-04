import {uniqBy} from 'ramda';

import { 
  GeonameTaxonomy, 
  SpotTaxonomy, 
  Taxonomy, 
  isGeonameTaxonomy, 
  isSpotTaxonomy, 
} from "surfline/taxonomy/types";
import { NONEXISTENT_BAJA_SUBREGION_ID } from 'surfline/taxonomy/constants';

import { Spot } from "../../shared/types";
import { get, notNull } from "../../shared/util";

export const createSlug = (spot: SpotTaxonomy): string => {
  // spot name + last 4 #s of spot id
  // empirically tested to not have collisions on dataset as of march 2023
  const base = `${spot.name} ${spot.spot.slice(20)}`;
  // return base.toLowerCase().replace(/ /g, '-');

  return base.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// another invalid spot id, seems like it's used for testing, filter it out...
const INVALID_SPOT_ID_SEYBOUSE = '584204214e65fad6a7709ce5';

export const parseSpots = (txs: Taxonomy[]): Spot[] => {
  const spots = txs.filter(isSpotTaxonomy)
    .filter(x => !x.liesIn.includes(NONEXISTENT_BAJA_SUBREGION_ID) && x.spot !== INVALID_SPOT_ID_SEYBOUSE);

  const geonames = txs.filter(isGeonameTaxonomy);

  const geonamesById = geonames.reduce((accum: {[key: string]: GeonameTaxonomy}, geo: GeonameTaxonomy) => {
    accum[geo._id] = geo;
    return accum;
  }, {});

  const parsedSpots = spots.map(spot => {
    const lat = spot.location.coordinates[1];
    const long = spot.location.coordinates[0];

    const geonames = spot.liesIn.filter(notNull).map(x => geonamesById[x]).filter(notNull);

    if (geonames.length === 0) {
      console.log(`Unable to find geoname for spot: ${spot._id}, ${spot.name}`);
    }

    const sortedGeonames = geonames.sort((a, b) => b.enumeratedPath.length - a.enumeratedPath.length);
    const closestGeoname = get(0, sortedGeonames);

    const locationNamePath = closestGeoname.enumeratedPath.split(',').slice(1);
    const locationParts = spotLocation(locationNamePath);
    const slug = createSlug(spot);

    return {
      id: spot.spot,
      taxonomyId: spot._id,
      name: spot.name,
      slug,
      location: {
        coords: {lat, long},
        ...locationParts,
      },
      geonames: geonames.map(geo => ({id: geo._id, name: geo.name})),
      geonameId: closestGeoname._id,
      locationNamePath
    };
  });

  const uniqueBySlug = uniqBy(x => x.slug, parsedSpots);

  if (parsedSpots.length !== uniqueBySlug.length) {
    throw new Error('Slug collision detected');
  }

  return parsedSpots;
};

// All spots have at least 3 location pieces (normally 5-7)
const spotLocation = (parts: Spot['locationNamePath']): Omit<Spot['location'], 'coords'> => {
  // parts[0] === 'Earth'
  const continent = parts[1];
  const country = parts[2];

  if (!continent || !country) throw new Error(`Unexpected access error for ${parts.join(',')}`);
  
  const regions = parts.slice(3);

  return {continent, country, regions};
};

type SpotGroup = {
  str: string;
  continent: string,
  country: string,
  region1: string | undefined,
  region2: string | undefined,
};

// groups spots by continent + country + (up to 2 regional pieces)
// this tends to produce pretty nice groupings (eg. CA / San Diego)
export const groupSpots = (spots: Spot[]): {group: SpotGroup, spots: Spot[]}[] => {
  const initialValue: {[key: string]: {group: SpotGroup, spots: Spot[]}} = {};

  const groups = spots.reduce((groups, spot) => {
    const group = groupForSpot(spot);

    groups[group.str] ||= {group, spots: []};

    // can't actually be undefined, but ts refinement misses this
    groups[group.str]?.spots.push(spot);

    return groups;
  }, initialValue);

  return Object.values(groups);
};

const groupForSpot = ({location}: Spot): SpotGroup => {
  const {continent, country, regions} = location;

  const region1 = regions[0];
  const region2 = regions[1];

  const str = [continent, country, region1, region2].filter(notNull).join(',');

  return {str, continent, country, region1, region2};
};
