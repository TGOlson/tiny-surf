import { fetchForecast } from 'surfline';
import { RatingForecast, TideForecast, WaveForecast, WindForecast } from 'surfline/forecasts/types';
import { Forecast } from "../../shared/types";
import { allEqual } from '../../shared/util';

export async function fetchCombinedForecast(spotId: string): Promise<Forecast> {
  const partialConfig = {spotId, days: 3, intervalHours: 3};

  const [waves, ratings, winds, tides] = await Promise.all([
    fetchForecast({type: 'wave', ...partialConfig}),
    fetchForecast({type: 'rating', ...partialConfig}),
    fetchForecast({type: 'wind', ...partialConfig}),
    fetchForecast({type: 'tides', ...partialConfig}),
  ]);

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
