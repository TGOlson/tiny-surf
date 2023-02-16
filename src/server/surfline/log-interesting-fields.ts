import path from 'path';
import fs from 'fs/promises';

import { RatingForecast, Units, WaveForecast, WindForecast } from 'surfline/forecasts/types';

const log = (x: string, filename: string): Promise<void> => {
  const p = path.resolve(__dirname, `../logs/${filename}`);
  return fs.writeFile(p, `${x}\n`, {flag: 'a'});
};

const logUnits = (units: Units) => () => log(JSON.stringify(units), 'units.json');

export const logInterestingWindFields = (x: WindForecast) => 
  Promise.all(x.data.wind.map(x => log(x.directionType, 'wind-direction-type.json')))
    .then(logUnits(x.associated.units));
    
export const logInterestingWaveFields = (x: WaveForecast) => 
  Promise.all(x.data.wave.map(x => log(x.surf.humanRelation, 'surf-human-relation.json')))
    .then(logUnits(x.associated.units));
  
export const logInterestingRatingFields = (x: RatingForecast) => 
  Promise.all(x.data.rating.map(x => log(x.rating.key, 'rating-key.json')));
