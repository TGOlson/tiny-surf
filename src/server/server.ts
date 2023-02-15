import express, { Response } from 'express';
import { parsedCASpots, parsedSpots } from './storage';
import { fetchCombinedForecast } from './surfline/forecast';
import { isSurflineError } from 'surfline/error';

const app = express();
const port = 3000;

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

  fetchCombinedForecast(spotId).then(forecast => {
    res.json(forecast);
  }).catch(handle500(res));
});


export const startServer = () => app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
