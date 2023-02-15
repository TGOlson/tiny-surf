import { Forecast, Spot } from "../shared/types";

export async function fetchSpots(): Promise<Spot[]> {
  return fetch('/api/ca-spots').then(res => res.json() as Promise<Spot[]>);
}

export async function fetchForecast(spotId: string): Promise<Forecast> {
  console.log('fetching forecast for spot', spotId);

  return fetch(`/api/forecast/${spotId}`).then(res => res.json() as Promise<Forecast>);
}
