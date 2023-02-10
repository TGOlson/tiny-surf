import {uniqBy} from 'ramda';

import { Spot } from "../../shared/types";
import { notNull } from "../../shared/util";
import { GeonameTaxonomy, isGeonameTaxonomy, isRegionTaxonomy, isSpotTaxonomy, isSubregionTaxonomy, Taxonomy } from "./taxonomy/types";

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

export const parseSpots = (txs: Taxonomy[]): Spot[] => {
  const spots = txs.filter(isSpotTaxonomy);
  const geonames = txs.filter(isGeonameTaxonomy);

  const geonamesById = geonames.reduce((accum: {[key: string]: GeonameTaxonomy}, geo: GeonameTaxonomy) => {
    accum[geo._id] = geo;
    return accum;
  }, {});

  return spots.map(spot => {
    const lat = spot.location.coordinates[1];
    const long = spot.location.coordinates[0];

    const liesInOne = geonamesById[spot.liesIn[0]];
    const liesInTwo = geonamesById[spot.liesIn[1]];

    // TODO: this happens a little more than expected
    // maybe the full dataset is not quite as fully inclusize as expected
    // may need to improve crawling logic later...
    if (!liesInOne && !liesInTwo) {
      console.log(`Unable to find geoname for spot: ${spot._id}, ${spot.name}`);
    }

    const enumeratedPathOne = liesInOne ? liesInOne.enumeratedPath : '';
    const enumeratedPathTwo = liesInTwo ? liesInTwo.enumeratedPath : '';

    const enumeratedPath = enumeratedPathOne.length > enumeratedPathTwo.length ? enumeratedPathOne : enumeratedPathTwo;
    const locationNamePath = enumeratedPath.split(',').slice(1);

    return {
      id: spot._id,
      name: spot.name,
      location: {lat, long},
      locationNamePath
    };
  });
};
