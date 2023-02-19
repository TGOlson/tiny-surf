import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, LinearProgress, Tab, Tabs, Typography } from '@mui/material';
import { DateTime, FixedOffsetZone }  from 'luxon';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { daySelected, fetchForecast } from '../slices/forecast-slice';

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

  let content = null;

  if (!forecast || forecast.status === 'idle' || forecast.status === 'pending' ) {
    content = (
      <Box sx={{ 
        width: '100%',
        marginTop: '32px',
        padding: '32px',
      }}>
        <LinearProgress />
      </Box>
    );
  } else if (forecast.status === 'rejected') {
    content = <p>Error: {forecast.error}</p>;
  } else {
    const {data, units, utcOffset} = forecast.data;
  
    const waves = data.waves.map(addDateTime(utcOffset)).filter(isDay(day));
    const wind = data.wind.map(addDateTime(utcOffset)).filter(isDay(day));
    const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(day));
  
    content = (
      <React.Fragment>
        <p>Rating: {data.ratings[0]?.key}</p>
        <Typography sx={{ fontSize: 12 }}>WAVES</Typography>
        <WaveChart data={waves} units={units}/>
        <Typography sx={{ fontSize: 12 }}>WIND</Typography>
        <WindChart data={wind} units={units}/>
        <Typography sx={{ fontSize: 12 }}>TIDE</Typography>
        <TideChart data={tides} units={units}/>
      </React.Fragment>
    );
  }
  
  const locationParts = spot.locationNamePath;
  const nParts = spot.locationNamePath.length;
  const location = `${locationParts[nParts - 1] ?? ''}, ${locationParts[nParts - 2] ?? ''}`;

  return (
    <Card sx={{minHeight: '504px'}}>
      <CardHeader 
        title={spot.name} 
        subheader={location}
        subheaderTypographyProps={{fontSize: 14}}
      />
      <Divider />
      <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
      <Tabs
          value={day}
          onChange={(_e, value) => dispatch(daySelected(value as (0 | 1 | 2)))}
        >
          <Tab value={0} label="Today" />
          <Tab value={1} label="Tomorrow" />
          <Tab value={2} label={DateTime.now().plus({days: 2}).weekdayLong} />
        </Tabs>
      </CardActions>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default SpotInfo;
