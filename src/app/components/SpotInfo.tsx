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

  return (
    <p>{spot.name}</p>
  );
};

export default SpotInfo;
