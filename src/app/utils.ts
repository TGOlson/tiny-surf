import { Spot } from "../shared/types";

type SpotLocation = {
  continent: string,
  country: string,
  largeRegion: [string, string]
  smallRegion: [string, string]
};

// All spots have at least 5 or 6 location pieces
// So this should be a safe operation
// TODO: change spot parsing to account for his
export const spotLocation = ({locationNamePath: parts}: Spot): SpotLocation => {
  const nParts = parts.length;

  // parts[0] === 'Earth'
  const continent = parts[1];
  const country = parts[2];
  
  const region1 = parts[3];
  const region2 = parts[4];
  
  const smallRegion1 = parts[nParts - 1];
  const smallRegion2 = parts[nParts - 2];

  if (!continent || !country || !region1 || !region2 || !smallRegion1 || !smallRegion2) throw new Error('Unexpected access error');

  const largeRegion: [string, string] = [region1, region2];
  const smallRegion: [string, string] = [smallRegion1, smallRegion2];

  return {continent, country, largeRegion, smallRegion};
};
