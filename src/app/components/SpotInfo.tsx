import React, { useEffect, useState } from 'react';

import { Forecast, Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchForecast } from '../slices/forecast-slice';

import { Line } from 'react-chartjs-2';

// little hack to register everything from chart.js
// alternative is to use `.register` on ever component we use
import 'chart.js/auto';
import 'chartjs-adapter-luxon';

type Params = {
  spot: Spot;
};
const timeString = (ts: number): string => {
  // TODO: use utc offset
  const date = new Date(ts);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours > 12 ? hours - 12 : hours}:${minutes}${hours >= 12 ? 'pm' : 'am'}`;
};

const TideChart = ({tides}: {tides: Forecast['data']['tides']}) => {


  const data = {
    datasets: [{
      data: tides.map(tide => ({x: tide.timestamp, y: tide.height})),
    }]
  };

  return (
    <Line 
      data={data} 
      options={{
        scales: {
          x: {
            type: 'time',
            time: {
              // Luxon format string
              tooltipFormat: 't',
            },
          },
        },
        plugins: {
          legend: {
              display: false,
          },
        }
      }} 
    />
  );
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

  const {data, units} = forecast.data;

  return (
    <div>
      <p>{spot.name}</p>
      <p>Rating: {data.ratings[0]?.key}</p>
      <p>Wave height: {data.waves[0]?.min}-{data.waves[0]?.max} {units.waveHeight.toLowerCase()}.</p>
      <p>Wind: {data.wind[0]?.speed} {units.windSpeed.toLowerCase()}.</p>
      <TideChart tides={data.tides.slice(0, 23)}/>
      <p>Tides:</p>
      <ul>
        {forecast.data.data.tides.filter(x => x.type !== 'NORMAL').map(tide => {
          return (
            <li key={tide.timestamp}>Tide: <span>{tide.type}</span> at <span>{(new Date(tide.timestamp)).toLocaleString()}</span></li>
          );
        })}
      </ul>
    </div>
  );
};

export default SpotInfo;
