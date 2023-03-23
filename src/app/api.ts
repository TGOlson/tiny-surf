import { Forecast, Spot } from "../shared/types";
import { fetchCombinedForecast } from "../shared/forecast";

export async function fetchSpots(): Promise<Spot[]> {
  return fetch('/tiny-surf/data/parsed/spots.json').then(res => res.json() as Promise<Spot[]>);
}

export async function fetchForecast(spotId: string): Promise<Forecast> {
  console.log('fetching forecast for spot', spotId);

  return fetchCombinedForecast(spotId);
}
