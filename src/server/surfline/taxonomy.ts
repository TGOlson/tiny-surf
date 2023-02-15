
import {uniqBy} from 'ramda';
import { 
  TaxonomyResponse, 
  GeonameTaxonomy, 
  SpotTaxonomy, 
  Taxonomy, 
  isGeonameTaxonomy, 
  isRegionTaxonomy, 
  isSpotTaxonomy, 
  isSubregionTaxonomy 
} from "surfline/taxonomy/types";
import { NONEXISTENT_BAJA_SUBREGION_ID } from 'surfline/taxonomy/constants';
import { referencesBadId } from "surfline/taxonomy";

import { Spot } from "../../shared/types";
import { notNull } from "../../shared/util";

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

const toTaxonomy = (tx: TaxonomyResponse): Taxonomy => {
  const newTx: Taxonomy = {...tx};

  if ('in' in newTx) newTx.in = undefined;
  if ('contains' in newTx) newTx.contains = undefined;

  return newTx;
};

export const flattenTaxonomyResponse = (tx: TaxonomyResponse): Taxonomy[] => tx.contains.concat(tx.in).concat([toTaxonomy(tx)]);