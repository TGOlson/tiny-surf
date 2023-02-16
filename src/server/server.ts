import express, { Response } from 'express';
import morgan from 'morgan';
import path from 'path';

import { parsedCASpots, parsedSpots } from './storage';
import { fetchCombinedForecast } from './surfline/forecast';
import { isSurflineError } from 'surfline/error';
import nocache from 'nocache';
import { makeTTLCache } from './ttl-cache';

const app = express();

app.use(nocache());
app.use(morgan('tiny'));
app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/assets/js', express.static(path.resolve(__dirname, '../dist')));

const forecastCache = makeTTLCache({
  // forecasts don't change often, only expire entries after 30m
  ttlSeconds: 60 * 30, 
  debug: true
});

const PORT = 3000;

const hasMessage = (error: unknown): error is object & {message: string} => {
  return error !== null 
    && typeof error === 'object'
    && 'message' in error
    && typeof error.message === 'string';
};

const handle500 = (res: Response) => (err: unknown) => {
  if (isSurflineError(err)) {
    const message = `Surfline Error: ${err.message}`;
    res.status(err.status).json({message});
  } else {
    const message = hasMessage(err) ? err.message : 'Unknown error';
    res.status(500).json({message});
  }
};

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

// TODO: add logging to api calls (esp for fields w/ unknown types)
// TODO: use time based cache to limit amount of calls to surfline

// for testing: tourmaline id = 5842041f4e65fad6a77088c4
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

export const startServer = () => app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
