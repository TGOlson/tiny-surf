import { groupBy, map, sortWith } from "ramda";

import { Spot } from "../../shared/types";
import { getObj } from "../../shared/util";

const continentSortOrder: Record<string, number> = {
  'North America': 0,
  'South America': 1,
  'Europe': 2,
  'Africa': 3,
  'Asia': 4,
  'Oceania': 5,
};

const avg = (xs: number[]): number => xs.reduce((x, y) => x + y) / xs.length;

const stdDev = (xs: number[]): number => {
  const mean = avg(xs);
  const variance = xs.reduce((acc, cur) => acc + Math.pow(cur - mean, 2), 0) / xs.length;
  return Math.sqrt(variance);
};

type DatasetAnalysis = {
  avg: number, 
  min: number, 
  max: number, 
  stdDev: number
};

const getDatasetAnalysis = (xs: number[]): DatasetAnalysis => ({
  avg: avg(xs),
  min: Math.min(...xs),
  max: Math.max(...xs),
  stdDev: stdDev(xs),
});

type LatLongData = {lat: DatasetAnalysis, long: DatasetAnalysis};

const getLatLongData = (xs: {lat: number, long: number}[]): LatLongData => {
  const lat = getDatasetAnalysis(xs.map(x => x.lat));
  const long = getDatasetAnalysis(xs.map(x => x.long));

  return {lat, long};
};


// rules
// 
// * sort continent by pre-defined list above
// * sort each country within a continent by average latitude
// * sort each region within a country by std deviations from avg country long, then avg latitude 
// * sort each spot by latitude
export const sortSpots = (spots: Spot[]): Spot[] => {
  const countryGroups = groupBy(({location}) => location.country, spots);

  const countryGroupsData: Record<string, LatLongData> = map(spots => {
    return getLatLongData(spots.map(x => x.location.coords));
  }, countryGroups);

  const spotsWithRegions = spots.filter(spot => spot.location.regions.length > 0);
  const regionString = ({location}: Spot): string => [location.continent, location.country, location.regions[0]].join(',');
  const regionGroups = groupBy(spot => regionString(spot), spotsWithRegions);

  const regionGroupsData: Record<string, LatLongData> = map(spots => {
    return getLatLongData(spots.map(x => x.location.coords));
  }, regionGroups);

  const compareContinent = (a: Spot, b: Spot): number => 
    getObj(a.location.continent, continentSortOrder) - getObj(b.location.continent, continentSortOrder);

  const compareCountry = (a: Spot, b: Spot): number => 
    getObj(b.location.country, countryGroupsData).lat.avg - getObj(a.location.country, countryGroupsData).lat.avg;

  const compareRegionLong = (a: Spot, b: Spot): number => {
    const aRegion = a.location.regions[0];
    const bRegion = b.location.regions[0];

    // a few spots don't have a region, no biggy just skip em and sort by lat/long later
    if (aRegion === undefined || bRegion === undefined) return 0;

    const aCountryData = getObj(a.location.country, countryGroupsData);
    const bCountryData = getObj(b.location.country, countryGroupsData);
    const aRegionData = getObj(regionString(a), regionGroupsData);
    const bRegionData = getObj(regionString(b), regionGroupsData);

    const aLongStdDevs = (aRegionData.long.avg - aCountryData.long.avg) / aCountryData.long.stdDev;
    const bLongStdDevs = (bRegionData.long.avg - bCountryData.long.avg) / bCountryData.long.stdDev;

    return Math.round(aLongStdDevs) - Math.round(bLongStdDevs);
  };

  const compareRegionLat = (a: Spot, b: Spot): number => {
    const aRegion = a.location.regions[0];
    const bRegion = b.location.regions[0];

    // a few spots don't have a region, no biggy just skip em and sort by lat/long later
    if (aRegion === undefined || bRegion === undefined) return 0;

    const aRegionData = getObj(regionString(a), regionGroupsData);
    const bRegionData = getObj(regionString(b), regionGroupsData);

    return bRegionData.lat.avg - aRegionData.lat.avg;
  };

  const compareSpotLat = (a: Spot, b: Spot): number => {
    return b.location.coords.lat - a.location.coords.lat;
  };

  return sortWith([
    compareContinent,
    compareCountry,
    compareRegionLong,
    compareRegionLat,
    compareSpotLat,
  ], spots);
};
