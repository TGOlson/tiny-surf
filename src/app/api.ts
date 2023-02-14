import { fetchCombinedForecast } from "../server/surfline/forecasts";
import { Forecast, Spot } from "../shared/types";

export async function fetchSpots(): Promise<Spot[]> {
  return fetch('/api/ca_spots.json')
      .then(res => res.json() as Promise<Spot[]>);
}

export async function fetchForecast(spotId: string): Promise<Forecast> {
  console.log('fetching forecast for spot', spotId);
  return fetchCombinedForecast({
    spotId,
    days: 3,
    intervalHours: 24,
  });
}
