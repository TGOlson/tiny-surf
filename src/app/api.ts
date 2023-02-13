import { Spot } from "../shared/types";

export async function fetchSpots(): Promise<Spot[]> {
  return fetch('/api/ca_spots.json')
      .then(res => res.json() as Promise<Spot[]>);
}
