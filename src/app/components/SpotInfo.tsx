import React, { useEffect } from 'react';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchForecast } from '../slices/forecast-slice';

import { DateTime, FixedOffsetZone }  from 'luxon';

import WaveChart from './charts/WaveChart';
import TideChart from './charts/TideChart';
import WindChart from './charts/WindChart';

type Params = {
  spot: Spot;
};

const getDateTime = (ts: number, offset: number): DateTime => {
  const zone = FixedOffsetZone.instance(offset * 60); // offset in minutes
  return DateTime.fromMillis(ts, {zone});
};

function addDateTime<T extends object & {timestamp: number}>(utcOffset: number): (x: T) => T & {datetime: DateTime} {
  return (x: T) => ({...x, datetime: getDateTime(x.timestamp, utcOffset)});
}

const isDay = (dayOffset: number) => (x: object & {datetime: DateTime}) => 
  x.datetime.day === DateTime.now().plus({days: dayOffset}).day;

const SpotInfo = ({spot}: Params) => {
  const dispatch = useAppDispatch();
  
  const forecast = useAppSelector(st => st.forecast.forecasts[spot.id]);
  const day = useAppSelector(st => st.forecast.day);

  useEffect(() => {
    if (!forecast || forecast.status === 'idle') void dispatch(fetchForecast(spot.id));
  }, [forecast, dispatch]);

  if (!forecast || forecast.status === 'idle' || forecast.status === 'pending' ) {
    return <p>Loading...</p>;
  }

  if (forecast.status === 'rejected') {
    return <p>Error: {forecast.error}</p>;
  }

  const {data, units, utcOffset} = forecast.data;

  const dayOffset = day === 'today' ? 0 : 1;

  const waves = data.waves.map(addDateTime(utcOffset)).filter(isDay(dayOffset));
  const wind = data.wind.map(addDateTime(utcOffset)).filter(isDay(dayOffset));
  const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(dayOffset));

  return (
    <div>
      <p>{spot.locationNamePath[spot.locationNamePath.length - 1]}</p>
      <p>{spot.name}</p>
      <p>Rating: {data.ratings[0]?.key}</p>
      <p>Waves</p>
      <WaveChart data={waves} units={units}/>
      <p>Wind</p>
      <WindChart data={wind} units={units}/>
      <p>Tide</p>
      <TideChart data={tides} units={units}/>
    </div>
  );
};

export default SpotInfo;
