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

// https://support.surfline.com/hc/en-us/articles/9780949042843-Surf-Conditions-Ratings-Colors
export const ratingColor = (rating: RatingDetails['key'], opacity = 1): string => {
  switch (rating) {
    case 'VERY_POOR': return `rgba(163, 172, 186, ${opacity})`;
    case 'POOR': return `rgba(67, 156, 255, ${opacity})`;
    case 'POOR_TO_FAIR': return `rgba(49, 210, 233, ${opacity})`;
    case 'FAIR': return `rgba(26, 214, 76, ${opacity})`;
    case 'FAIR_TO_GOOD': return `rgba(255, 209, 2, ${opacity})`;
    case 'GOOD': return `rgba(255, 143, 0, ${opacity})`;
    case 'EPIC': return `rgba(221, 69, 46, ${opacity})`;
  }
};
