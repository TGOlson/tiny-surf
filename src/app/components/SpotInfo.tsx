import React, { useEffect } from 'react';
import { DateTime, FixedOffsetZone }  from 'luxon';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AirIcon from '@mui/icons-material/Air';
import SurfingIcon from '@mui/icons-material/Surfing';
import WavesIcon from '@mui/icons-material/Waves';

import WaveChart from './charts/WaveChart';
import TideChart from './charts/TideChart';
import WindChart from './charts/WindChart';
import RatingChart from './charts/RatingChart';
import ForecastCard from './ForecastCard';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchForecast } from '../slices/forecast-slice';
import { smallRegion } from '../utils';
import DayTabs from './DayTabs';

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

const isDay = (timezoneOffset: number, dayOffset: number) => (x: object & {datetime: DateTime}) => {
  const zone = FixedOffsetZone.instance(timezoneOffset * 60); // offset in minutes
  return x.datetime.day === DateTime.now().setZone(zone).plus({days: dayOffset}).day;
}

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
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
      }}>
        <CircularProgress />
      </Box>
    );
  } else if (forecast.status === 'rejected') {
    content = <p>Error: {forecast.error}</p>;
  } else {
    const {data, units, utcOffset} = forecast.data;
  
    const ratings = data.ratings?.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const waves = data.waves.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const wind = data.wind.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));

    content = (
      <React.Fragment>
        <ForecastCard title='RATING' icon={<AutoAwesomeIcon />} height={'40px'}>
          {ratings ? <RatingChart type="bar" data={ratings} /> : <Typography level="body4">n/a</Typography>}
        </ForecastCard>

        <ForecastCard title='WAVE' icon={<SurfingIcon />}>
          <WaveChart data={waves} units={units} />
        </ForecastCard>

        <ForecastCard title='WIND' icon={<AirIcon />}>
          <WindChart data={wind} units={units}/>
        </ForecastCard>

        <ForecastCard title='TIDE' icon={<WavesIcon />}>
          <TideChart data={tides} units={units}/>
        </ForecastCard>
      </React.Fragment>
    );
  }
  
  const location = smallRegion(spot).join(', ');

  return (
    <Stack sx={{gap: 2}}>
      <Card variant="outlined" sx={{borderRadius: 'sm'}}>
        <Typography level="h4" fontSize="lg">{spot.name}</Typography>
        <Typography level="body2">{location}</Typography>
      </Card>
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <DayTabs day={day} />
    </Box>
      {content}
    </Stack>
  );
};

export default SpotInfo;
