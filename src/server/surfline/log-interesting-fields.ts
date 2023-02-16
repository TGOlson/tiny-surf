import path from 'path';
import fs from 'fs/promises';

import { RatingForecast, WaveForecast, WindForecast } from 'surfline/forecasts/types';

const log = (x: string, filename: string): Promise<void> => {
  const p = path.resolve(__dirname, `../logs/${filename}`);
  return fs.writeFile(p, `${x}\n`, {flag: 'a'});
};

export const logInterestingWindFields = (x: WindForecast) => 
  log(JSON.stringify({
    'x.data.wind[0]?.directionType': x.data.wind[0]?.directionType,
  }), 'wind.json');

export const logInterestingWaveFields = (x: WaveForecast) => 
  log(JSON.stringify({
    'x.data.wave[0]?.surf.humanRelation': x.data.wave[0]?.surf.humanRelation,
  }), 'wave.json');

export const logInterestingRatingFields = (x: RatingForecast) => 
  log(JSON.stringify({
    'x.data.rating[0]?.rating.key': x.data.rating[0]?.rating.key,
  }), 'rating.json');
