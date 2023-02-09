import { useDispatch } from 'react-redux';
import { LoaderFunctionArgs, Params, redirect } from 'react-router-dom';
import { Spot } from '../shared/types';
import { fetchRegion } from './api';
import { addRegion } from './region-reducer';

const getParam = (key: string) => (params: Params): string => {
  const val = params[key];
  if (!val) throw new Error(`Unexpected routing error: no key ${key}`);

  return val;
};

const getRegionId = getParam('regionId');
const getSpotId = getParam('spotId');

// Load a region then redirect to the first spot in that region
export async function regionLoader({params}: LoaderFunctionArgs): Promise<Response> {
  const regionId = getRegionId(params);
  console.log('regionId', regionId);

  const region = await fetchRegion(regionId);
  const spots = region.spots;

  const spot = spots[0];
  if (!spot) throw new Error(`Unexpected error: no spots found for region ${region.id}, ${region.name}`);

  return redirect(`/r/${regionId}/s/${spot.id}`);
}

export async function spotLoader({params}: LoaderFunctionArgs): Promise<{selected: string, spots: Spot[]}> {
  const regionId = getRegionId(params);
  const spotId = getSpotId(params);
  
  console.log('regionId', regionId);
  console.log('spotId', spotId);

  const region = await fetchRegion(regionId);

  return {selected: spotId, spots: region.spots};
}
