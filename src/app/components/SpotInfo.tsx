import React, { useEffect } from 'react';
import { DateTime, FixedOffsetZone }  from 'luxon';

import Box from '@mui/system/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import LinearProgress from '@mui/joy/LinearProgress';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SurfingIcon from '@mui/icons-material/Surfing';
import WavesIcon from '@mui/icons-material/Waves';
import AirIcon from '@mui/icons-material/Air';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { daySelected, fetchForecast } from '../slices/forecast-slice';

import WaveChart from './charts/WaveChart';
import TideChart from './charts/TideChart';
import WindChart from './charts/WindChart';
import { smallRegion } from '../utils';

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
  
    const ratings = data.ratings?.map(addDateTime(utcOffset)).filter(isDay(day));
    const waves = data.waves.map(addDateTime(utcOffset)).filter(isDay(day));
    const wind = data.wind.map(addDateTime(utcOffset)).filter(isDay(day));
    const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(day));

    content = (
      <React.Fragment>
        <Stack>
          <Typography level="body4" startDecorator={<AutoAwesomeOutlinedIcon />}>RATING</Typography>
          <Typography level="body4">{ratings?.map(x => x.value).join(', ')}</Typography>
        </Stack>
        <Stack>
          <Typography level="body4" startDecorator={<SurfingIcon />}>WAVES ({units.waveHeight.toLowerCase()}.)</Typography>
          <WaveChart data={waves} units={units}/>
        </Stack>
        <Stack>
          <Typography level="body4" startDecorator={<AirIcon />}>WIND ({units.windSpeed.toLowerCase()}.)</Typography>
          <WindChart data={wind} units={units}/>
        </Stack>
        <Stack>
          <Typography level="body4" startDecorator={<WavesIcon />}>TIDE ({units.tideHeight.toLowerCase()}.)</Typography>
          <TideChart data={tides} units={units}/>
        </Stack>
      </React.Fragment>
    );
  }
  
  const location = smallRegion(spot).join(', ');

  return (
    <Card sx={{minHeight: '504px', gap: 1.5}}>
      <Box>
        <Typography level="h4" fontSize="lg">{spot.name}</Typography>
        <Typography level="body2">{location}</Typography>
      </Box>
      <Divider />
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <Tabs
          size="sm"
          value={day}
          onChange={(_e, value) => dispatch(daySelected(value as (0 | 1 | 2)))}
        >
          <TabList>
            <Tab value={0}>Today</Tab>
            <Tab value={1}>Tomorrow</Tab>
            <Tab value={2}>{DateTime.now().plus({days: 2}).weekdayLong}</Tab>
          </TabList>
        </Tabs>
      </Box>
      <CardContent sx={{gap: 1.5}}>
        {content}
      </CardContent>
    </Card>
  );
};

export default SpotInfo;
