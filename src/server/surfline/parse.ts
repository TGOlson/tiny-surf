import {all, uniq, uniqBy} from 'ramda';

import { Forecast, Spot } from "../../shared/types";
import { notNull } from "../../shared/util";
import { RatingForecast, TideForecast, Units, WaveForecast, WindForecast } from './forecasts/types';
import { NONEXISTENT_BAJA_SUBREGION_ID, NONEXISTENT_GREECE_SUBREGION_ID } from './taxonomy/constants';
import { GeonameTaxonomy, SpotTaxonomy, Taxonomy } from "./taxonomy/types";
import { isGeonameTaxonomy, isRegionTaxonomy, isSpotTaxonomy, isSubregionTaxonomy } from "./taxonomy/types";

export type TaxonomyInspection = {
  numIds: number,
  numUniqueIds: number,
  numSpots: number,
  numSubregions: number,
  numRegions: number,
  numGeonames: number,
  liesInIds: {
    numTotal: number,
    numUnique: number,
    unlinked: {
      num: number,
      vals: string[],
    },
    uniqueUnlinked: {
      num: number,
      vals: string[]
    }
  }
};

const referencesBadId = (tx: Taxonomy): boolean => {
  return tx.liesIn.includes(NONEXISTENT_GREECE_SUBREGION_ID) 
    || tx.liesIn.includes(NONEXISTENT_BAJA_SUBREGION_ID);
};

export const cleanTaxonomy = (txs: Taxonomy[]): Taxonomy[] => {
  return uniqBy(x => x._id, txs)
    .filter(x => x.liesIn ? !referencesBadId(x) : true);

};

// A taxonomy is a slightly-complicated semi-recursive data structre with a few different sub-types
// This is a helper function which is meant to inspect a full data structure to see if there are missing elements
export const inspectTaxonomy = (txs: Taxonomy[]): TaxonomyInspection => {
  const uniqueTxs = uniqBy(x => x._id, txs);

  const numSpots = uniqueTxs.filter(isSpotTaxonomy).length;
  const numSubregions = uniqueTxs.filter(isSubregionTaxonomy).length;
  const numRegions = uniqueTxs.filter(isRegionTaxonomy).length;
  const numGeonames = uniqueTxs.filter(isGeonameTaxonomy).length;

  const uniqueIdMap = uniqueTxs.map(x => x._id)
    .reduce((accum: {[key: string]: boolean}, id) => {
      accum[id] = true;
      return accum;
    }, {});

  const liesInIds = uniqueTxs.flatMap(x => x.liesIn).filter(notNull);
  const uniqueLiesInIds = [...new Set(liesInIds)];

  const unlinkedLiesInIds = liesInIds.filter(id => !uniqueIdMap[id]);
  const uniqueUnlinkedLiesIdIds = [...new Set(unlinkedLiesInIds)];

  return {
    numIds: txs.length,
    numUniqueIds: uniqueTxs.length,
    numSpots,
    numSubregions,
    numRegions,
    numGeonames,
    liesInIds: {
      numTotal: liesInIds.length,
      numUnique: uniqueLiesInIds.length,
      unlinked: {
        num: unlinkedLiesInIds.length,
        vals: unlinkedLiesInIds
      },
      uniqueUnlinked: {
        num: uniqueUnlinkedLiesIdIds.length,
        vals: uniqueUnlinkedLiesIdIds,
      }
    }
  };
};

const createSlug = (spot: SpotTaxonomy): string => {
  const base = `${spot.name} ${spot.spot.slice(20)}`;
  return base.toLowerCase().replace(/ /g, '-');
};

export const parseSpots = (txs: Taxonomy[]): Spot[] => {
  const spots = txs.filter(isSpotTaxonomy).filter(x => !x.liesIn.includes(NONEXISTENT_BAJA_SUBREGION_ID));
  const geonames = txs.filter(isGeonameTaxonomy);

  const geonamesById = geonames.reduce((accum: {[key: string]: GeonameTaxonomy}, geo: GeonameTaxonomy) => {
    accum[geo._id] = geo;
    return accum;
  }, {});

  return spots.map(spot => {
    const lat = spot.location.coordinates[1];
    const long = spot.location.coordinates[0];

    const geonames = spot.liesIn.filter(notNull).map(x => geonamesById[x]).filter(notNull);

    if (geonames.length === 0) {
      console.log(`Unable to find geoname for spot: ${spot._id}, ${spot.name}`);
    }

    const sortedGeonames = geonames.sort((a, b) => b.enumeratedPath.length - a.enumeratedPath.length);

    const closestGeoname = sortedGeonames[0];

    if (!closestGeoname) throw new Error('Unexpected access error');

    const locationNamePath = closestGeoname.enumeratedPath.split(',').slice(1);
    const slug = createSlug(spot);

    return {
      id: spot.spot,
      taxonomyId: spot._id,
      name: spot.name,
      slug,
      location: {lat, long},
      geonameId: closestGeoname._id,
      locationNamePath
    };
  });
};

function allEqualBy<T, K>(fn: (x: T) => K, xs: T[]): boolean {
  return allEqual(xs.map(fn));
}

function allEqual<T>(xs: T[]): boolean {
  return uniq(xs).length === 1;
}

export const parseForecast = (
  spotId: string, 
  waves: WaveForecast, 
  ratings: RatingForecast,
  winds: WindForecast,
  tides: TideForecast,
): Forecast => {

  // TODO: could check if these are the same aross all forecast
  const units = waves.associated.units;
  const utcOffset = waves.associated.utcOffset;

  const wavesStart = Math.min(...waves.data.wave.map(x => x.timestamp));
  const ratingsStart = Math.min(...ratings.data.rating.map(x => x.timestamp));
  const windStart = Math.min(...winds.data.wind.map(x => x.timestamp));
  const tidesStart = Math.min(...tides.data.tides.map(x => x.timestamp));
  const startTimestamp = wavesStart;

  if (!allEqual([wavesStart, ratingsStart, windStart, tidesStart])) {
    console.log('uneven start tides', wavesStart, ratingsStart, windStart, tidesStart);
  }

  const parsedWaves = waves.data.wave.map(wave => {
    const {min, max, plus} = wave.surf;
    const hour = (wave.timestamp - startTimestamp) / 60 / 60;

    return {hour, min, max, plus};
  });

  const parsedRatings = ratings.data.rating.map(rating => {
    const {key, value} = rating.rating;
    const hour = (rating.timestamp - startTimestamp) / 60 / 60;
    
    return {key, value, hour};
  });

    const parsedWind = winds.data.wind.map(wind => {
      const {speed, direction, timestamp} = wind;
      const hour = (timestamp - startTimestamp) / 60 / 60;
      
      return {speed, direction, hour};
    });
    
  const parsedTides = tides.data.tides.map(tide => {
    const {height, type, timestamp} = tide;
    const hour = (timestamp - startTimestamp) / 60 / 60;

    return {height, type, hour};
  });

  return {
    spotId,
    units,
    startTimestamp,
    utcOffset,
    data: {
      waves: parsedWaves, 
      ratings: parsedRatings,
      wind: parsedWind,
      tides: parsedTides,
    }
  };
};
