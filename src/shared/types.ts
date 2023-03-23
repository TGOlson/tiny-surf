import { RatingDescription, Tide, Units, WaveSizeDescription, Wind } from "surfline/forecasts/types";

export type Spot = {
  id: string, // corresponds to surfline spot id
  taxonomyId: string, // corresponds to surfline taxonomy id
  name: string,
  slug: string,
  location: {
    coords: {
      lat: number,
      long: number,
    },
    continent: string,
    country: string,
    // will have 0-5 items, with 2-3 being most common 
    // (eg. all California spots have 2-3 additional locations here)
    regions: string[]
  },
  geonameId: string, // id of closest geoname, not necessarily the closest taxonomy type
};

export type RatingDetails = {
  timestamp: number,
  key: RatingDescription,
  value: number,
};

export type WaveDetails = {
  timestamp: number,
  min: number,
  max: number,
  plus: boolean,
  description: WaveSizeDescription, 
};

export type WindDetails = {
  timestamp: number,
  speed: number,
  direction: number,
  directionType: Wind['directionType'],
};

export type TideDetails = {
  timestamp: number,
  height: number,
  type: Tide['type'],
};

export type Forecast = {
  spotId: string,
  units: Units,
  startTimestamp: number,
  utcOffset: number,
  data: {
    ratings: RatingDetails[] | null,
    waves: WaveDetails[],
    wind: WindDetails[],
    tides: TideDetails[],
  }
};
