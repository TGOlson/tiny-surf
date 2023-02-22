import React, { useEffect } from 'react';
import { DateTime, FixedOffsetZone }  from 'luxon';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import CircularProgress from '@mui/joy/CircularProgress';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

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
import RatingChart from './charts/RatingChart';

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
  
    const ratings = data.ratings?.map(addDateTime(utcOffset)).filter(isDay(day));
    const waves = data.waves.map(addDateTime(utcOffset)).filter(isDay(day));
    const wind = data.wind.map(addDateTime(utcOffset)).filter(isDay(day));
    const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(day));

    const SectionTitle = ({title, icon}: {title: string, icon: React.ReactElement | null}) => (
        <Typography sx={{minWidth: '52px', maxWidth: '52px'}} level="body4" startDecorator={icon}>{title}</Typography>
    );

    const ratingIcon = <Box
      component="span"
      sx={{
        bgcolor: 'neutral.400',
        width: '0.5em',
        height: '0.5em',
        borderRadius: '50%',
      }}
    />;

    content = (
      <React.Fragment>
        <Stack direction="row" sx={{mb: 1, alignItems: 'center'}}>
          <SectionTitle title='RATING' icon={ratingIcon} />
          {ratings ? <RatingChart data={ratings} /> : <Typography level="body4">n/a</Typography>}
        </Stack>
        <Stack direction="row" sx={{alignItems: 'center'}}>      
          <SectionTitle title='WAVE (ft.)' icon={<SurfingIcon />} />
          <WaveChart data={waves} units={units}/>
        </Stack>
        <Stack direction="row" sx={{alignItems: 'center'}}>        
          <SectionTitle title='WIND (kts.)' icon={<AirIcon />} />
          <WindChart data={wind} units={units}/>
        </Stack>
        <Stack direction="row" sx={{alignItems: 'center'}}>        
          <SectionTitle title='TIDE (ft.)' icon={<WavesIcon />} />
          <TideChart data={tides} units={units}/>
        </Stack>
      </React.Fragment>
    );
  }
  
  const location = smallRegion(spot).join(', ');

  return (
    <Card variant="outlined" sx={{gap: 1.5, height: '100%', borderRadius: 'sm'}}>
      <Box>
        <Typography level="h4" fontSize="lg">{spot.name}</Typography>
        <Typography level="body2">{location}</Typography>
      </Box>
      <Divider />
      <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
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
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default SpotInfo;
