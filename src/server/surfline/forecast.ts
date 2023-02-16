import { fetchForecast } from 'surfline';
import { RatingForecast, TideForecast, WaveForecast, WindForecast } from 'surfline/forecasts/types';
import { Forecast } from "../../shared/types";
import { allEqual } from '../../shared/util';
import { logInterestingRatingFields, logInterestingWaveFields, logInterestingWindFields } from './log-interesting-fields';

export async function fetchCombinedForecast(spotId: string): Promise<Forecast> {
  const partialConfig = {spotId, days: 3, intervalHours: 3};

  const [waves, ratings, winds, tides] = await Promise.all([
    fetchForecast({type: 'wave', ...partialConfig}),
    fetchForecast({type: 'rating', ...partialConfig}),
    fetchForecast({type: 'wind', ...partialConfig}),
    fetchForecast({type: 'tides', ...partialConfig}),
  ]);

  await logInterestingWaveFields(waves);
  await logInterestingRatingFields(ratings);
  await logInterestingWindFields(winds);

  return parseForecast(spotId, waves, ratings, winds, tides);
}

export const parseForecast = (
  spotId: string, 
  waves: WaveForecast, 
  ratings: RatingForecast,
  winds: WindForecast,
  tides: TideForecast,
): Forecast => {

  // TODO: could check if these are the same across all forecast
  const units = waves.associated.units;
  const utcOffset = waves.associated.utcOffset;

  const wavesStart = Math.min(...waves.data.wave.map(x => x.timestamp));
  const ratingsStart = Math.min(...ratings.data.rating.map(x => x.timestamp));
  const windStart = Math.min(...winds.data.wind.map(x => x.timestamp));
  const tidesStart = Math.min(...tides.data.tides.map(x => x.timestamp));
  const startTimestamp = wavesStart;

  if (!allEqual([wavesStart, ratingsStart, windStart, tidesStart])) {
    console.log('uneven start times', wavesStart, ratingsStart, windStart, tidesStart);
  }

  const parsedWaves = waves.data.wave.map(({timestamp, surf}) => {
    const {min, max, plus} = surf;
    return {timestamp, min, max, plus};
  });

  const parsedRatings = ratings.data.rating.map(({timestamp, rating}) => {
    const {key, value} = rating;
    return {timestamp, key, value};
  });

  const parsedWind = winds.data.wind.map(wind => {
    const {timestamp, speed, direction} = wind;
    return {timestamp, speed, direction};
  });
    
  const parsedTides = tides.data.tides.map(tide => {
    const {timestamp, height, type} = tide;
    return {timestamp, height, type};
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
