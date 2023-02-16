import React, { useEffect } from 'react';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchForecast } from '../slices/forecast-slice';

type Params = {
  spot: Spot;
};

const SpotInfo = ({spot}: Params) => {
  const dispatch = useAppDispatch();
  const forecast = useAppSelector(st => st.forecast.forecasts[spot.id]);


  useEffect(() => {
    if (!forecast || forecast.status === 'idle') void dispatch(fetchForecast(spot.id));
  }, [forecast, dispatch]);

  if (!forecast || forecast.status === 'idle' || forecast.status === 'pending' ) {
    return <p>Loading...</p>;
  }

  if (forecast.status === 'rejected') {
    return <p>Error: {forecast.error}</p>;
  }

  return (
    <div>
      <p>{spot.name}</p>
      <p>Rating: {forecast.data.data.ratings[0]?.key}</p>
      <p>Wave height: {forecast.data.data.waves[0]?.min}-{forecast.data.data.waves[0]?.max} {forecast.data.units.waveHeight.toLowerCase()}.</p>
      <p>Wind: {forecast.data.data.wind[0]?.speed} {forecast.data.units.windSpeed.toLowerCase()}.</p>
      <p>Tides:</p>
      <ul>
        {forecast.data.data.tides.filter(x => x.type !== 'NORMAL').map(tide => {
          return (
            <li key={tide.timestamp}>Tide: <span>{tide.type}</span> at <span>{(new Date(tide.timestamp * 1000)).toLocaleString()}</span></li>
          );
        })}
      </ul>
    </div>
  );
};

export default SpotInfo;
