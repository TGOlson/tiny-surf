import React, { useEffect } from 'react';
import { DateTime, FixedOffsetZone }  from 'luxon';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CircularProgress from '@mui/joy/CircularProgress';
import Stack from '@mui/joy/Stack';
import Link from '@mui/joy/Link';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import DayTabs from './DayTabs';
import SpotName from './SpotName';
import SpotLocation from './SpotLocation';
import ForecastContent from './ForecastContent';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchForecast } from '../slices/forecast-slice';
import { useNavigate } from 'react-router-dom';

type SpotInfoProps = {
  spot: Spot;
  experiments?: boolean;
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
};

const SpotInfo = ({spot, experiments = false}: SpotInfoProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
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
    const winds = data.wind.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));

    const props = {ratings, waves, winds, tides, units, experiments};
    content = <ForecastContent {...props} />;
  }

  const linkOnclick = () => experiments
    ? navigate(`/s/${spot.slug}`)
    : navigate(`/s/${spot.slug}/experiments`);

  const decorator = experiments ? <VisibilityOffIcon /> : <VisibilityIcon />;
  
  return (
    <Stack gap={2} sx={{marginTop: '-16px'}}>
      <Box>
        <Box display='flex' justifyContent='flex-end'>
          <Link onClick={linkOnclick} level="body3" endDecorator={decorator}>
            {experiments ? 'Experiments' : 'Experiments'}
          </Link>
        </Box>
        <Card variant="outlined" sx={{borderRadius: 'sm'}}>
          <SpotName spot={spot} />
          <SpotLocation spot={spot} type={'small-region'} />
        </Card>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <DayTabs day={day} />
      </Box>
      {content}
    </Stack>
  );
};

export default SpotInfo;
