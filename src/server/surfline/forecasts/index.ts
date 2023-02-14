import { CombinedForecast, ForecastQuery, RatingForecast, TideForecast, WaveForecast, WeatherForecast, WindForecast } from "./types";

type ForecastType = 'combined' | 'wind' | 'wave' | 'rating' | 'tides' | 'weather';

const BASE_FORECAST_URL = 'https://services.surfline.com/kbyg/spots/forecasts';

const forecastUrl = (type: ForecastType, {spotId, days, intervalHours}: ForecastQuery): string => 
  `${BASE_FORECAST_URL}${type === 'combined' ? '' : `/${type}`}?spotId=${spotId}&days=${days}&intervalHours=${intervalHours}`;

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return await res.json() as T;
}

function fetchForecast<T>(type: ForecastType): (q: ForecastQuery) => Promise<T> {
  return async (q: ForecastQuery) => {
    const url = forecastUrl(type, q);
    return fetchJSON<T>(url);
  };
}

export const fetchCombinedForecast = fetchForecast<CombinedForecast>('combined');
export const fetchWindForecast = fetchForecast<WindForecast>('wind');
export const fetchWaveForecast = fetchForecast<WaveForecast>('wave');
export const fetchRatingForecast = fetchForecast<RatingForecast>('rating');
export const fetchTidesForecast = fetchForecast<TideForecast>('tides');
export const fetchWeatherForecast = fetchForecast<WeatherForecast>('weather');
