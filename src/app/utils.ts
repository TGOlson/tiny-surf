import { RatingDetails, Spot } from "../shared/types";

// returns two smallest region segments for a spot
export const smallRegion = ({location}: Spot): [string, string | undefined] => {
  const parts = [location.country, ...location.regions];
  const nParts = parts.length;

  const smallRegion1 = parts[nParts - 1];
  const smallRegion2 = parts[nParts - 2];

  if (!smallRegion1) throw new Error('Unexpected access error');

  return [smallRegion1, smallRegion2];
};

// returns 2 largest region pieces for a spot, excluding continent
export const largeRegion = ({location}: Spot): [string, string | undefined, string | undefined] => {
  const region1 = location.regions[0];
  const region2 = location.regions[1];

  return [location.country, region1, region2];
};

export const DEFAULT_RATING_COLOR = '#a3acba';

export const ratingColor = (rating: RatingDetails['key']): string => {
  switch (rating) {
    case 'VERY_POOR': return DEFAULT_RATING_COLOR;
    case 'POOR': return '#439cff';
    case 'POOR_TO_FAIR': return '#31d2e9';
    case 'FAIR': return '#1ad64c';
    case 'FAIR_TO_GOOD': return '#ffd102';
    case 'GOOD': return '#ff8f00';
    case 'EPIC': return '#dd452e';
  }
};
