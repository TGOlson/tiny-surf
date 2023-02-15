import express, { Response } from 'express';
import { parsedCASpots, parsedSpots } from './storage';
import { fetchCombinedForecast } from './surfline/forecast';

const app = express();
const port = 3000;

const hasMessage = (error: unknown): error is object & {message: string} => {
  return error !== null 
    && typeof error === 'object'
    && 'message' in error
    && typeof error.message === 'string';
};

const handle500 = (res: Response) => (err: unknown) => {
  const message = hasMessage(err) ? err.message : 'Unknown error';
  res.status(500).json({message});
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

// TODO: better error handling on bad ids
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
