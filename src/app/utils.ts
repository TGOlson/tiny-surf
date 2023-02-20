import { Spot } from "../shared/types";

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
