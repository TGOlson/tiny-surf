import express, { Response } from 'express';
import morgan from 'morgan';
import path from 'path';

import { parsedCASpots, parsedSpots } from './storage';
import { fetchCombinedForecast } from './surfline/forecast';
import { isSurflineError } from 'surfline/error';
import nocache from 'nocache';
import { makeTTLCache, TTLCache } from './ttl-cache';
import { Forecast } from '../shared/types';

const app = express();

app.use(nocache());
app.use(morgan('tiny'));
app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/assets/js', express.static(path.resolve(__dirname, '../dist')));

const PORT = 8080;

const hasMessage = (error: unknown): error is object & {message: string} => {
  return error !== null 
    && typeof error === 'object'
    && 'message' in error
    && typeof error.message === 'string';
};

const handle500 = (res: Response) => (err: unknown) => {
  if (isSurflineError(err)) {
    const message = `Surfline Error: ${err.message}`;
    console.error('Handling surfline API error', err);
    res.status(err.status).json({message});
  } else {
    const message = hasMessage(err) ? err.message : 'Unknown error';
    console.error('Unexpected error', err);
    res.status(500).json({message});
  }
};

// TODO: if more things need to be passed in, make into a config object
const setupRoutes = (forecastCache: TTLCache<Forecast>) => {

  app.get('/api/spots', (_req, res) => {
    parsedSpots.read().then(spots => {
      res.json(spots);
    }).catch(handle500(res));
  });
  
  app.get('/api/ca-spots', (_req, res) => {
    parsedCASpots.read().then(spots => {
      res.json(spots);
    }).catch(handle500(res));
  });
  
  app.get('/api/forecast/:spotId', (req, res) => {
    const spotId = req.params.spotId;

    const cachedForecast = forecastCache.get(spotId);

    if (cachedForecast) {
      return res.json(cachedForecast);
    }
    
    fetchCombinedForecast(spotId).then(forecast => {
      forecastCache.set(spotId, forecast);
      
      res.json(forecast);
    }).catch(handle500(res));
  });

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  });
};

export const startServer = () => app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);

  const forecastCache: TTLCache<Forecast> = makeTTLCache({
    // forecasts don't change often, only expire entries after 30m
    ttl: 30 * 60 * 1000, 
    flushInterval: 15 * 60 * 1000,
    debug: true
  });

  setupRoutes(forecastCache);
});
