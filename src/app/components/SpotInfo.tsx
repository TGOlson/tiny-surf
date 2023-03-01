import React, { useEffect, useState } from 'react';
import { DateTime, FixedOffsetZone }  from 'luxon';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AirIcon from '@mui/icons-material/Air';
import WavesIcon from '@mui/icons-material/Waves';

import SpotName from './SpotName';
import SpotLocation from './SpotLocation';
import WindChart from './charts/WindChart';
import TideChart from './charts/TideChart';
import RatingChartGradient from './charts/RatingChartGradient';
import DayTabs from './DayTabs';

import { Spot } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchForecast } from '../slices/forecast-slice';
import SurflineLink from './SurflineLink';

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

const SpotInfo = ({spot}: SpotInfoProps) => {
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialExpandedState = parseInt(searchParams.get('expanded') ?? '') === 1;

  const [expanded, setExpanded] = useState(initialExpandedState);
  
  const forecast = useAppSelector(st => st.forecast.forecasts[spot.id]);
  const day = useAppSelector(st => st.forecast.day);

  useEffect(() => {
    if (!forecast || forecast.status === 'idle') void dispatch(fetchForecast(spot.id));
  }, [forecast, dispatch]);

  let error: React.ReactNode = null;
  let waveChart: React.ReactNode = null;
  let windChart: React.ReactNode = null;
  let tideChart: React.ReactNode = null;

  const emptyChart = <Box className='placeholder' sx={{width: '466px', height: '46px'}}></Box>;

  if (!forecast || forecast.status === 'idle' || forecast.status === 'pending' ) {
    waveChart = emptyChart;
    windChart = emptyChart;
    tideChart = emptyChart;
  } else if (forecast.status === 'rejected') {
    error = <p>Error: {forecast.error}</p>;
  } else {
    const {data, units, utcOffset} = forecast.data;
  
    const ratings = data.ratings?.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const waves = data.waves.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const winds = data.wind.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));
    const tides = data.tides.map(addDateTime(utcOffset)).filter(isDay(utcOffset, day));

    waveChart = <RatingChartGradient ratings={ratings} waves={waves} units={units} />;
    windChart = <WindChart data={winds} units={units}/>;
    tideChart = <TideChart data={tides} units={units}/>;
  }

  const onExpandedClick = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    setSearchParams(nextExpanded ? {expanded: '1'} : {});
  };
  
  return (
    <Stack sx={{mt: '-15px'}}>
      <Box sx={{display: 'flex', justifyContent: 'end', mr: '2px'}}>
        <SurflineLink spot={spot} />
      </Box>
      <Card variant="outlined" sx={{borderRadius: 'xs'}}>
        <Box sx={{mb: 1.5}}>
          <SpotName spot={spot} />
          <SpotLocation spot={spot} type={'small-region'} />
        </Box>
        {error ? error : waveChart}
        <Divider inset='none' sx={{mt: 1}} />
        {expanded ? 
          <Box sx={{mt: 1.5}}>
            <Stack display="flex">
              <Typography level="body4" startDecorator={<AirIcon />}>WIND</Typography>
              {windChart}
              <Divider inset='none' sx={{mt: 1.5, mb: 1.5}}/>
              <Typography level="body4" startDecorator={<WavesIcon />}>TIDE</Typography>
              {tideChart}
              <Divider inset='none' sx={{mt: 1}}/>
            </Stack>
          </Box> 
          : null
        }
        <CardOverflow sx={{display: 'flex', justifyContent: 'center'}}>
          <IconButton sx={{"--IconButton-size": "20px"}} color="neutral" variant="plain" onClick={onExpandedClick}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </CardOverflow>
      </Card>
      <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}}>
        <DayTabs day={day} />
      </Box>
    </Stack>
  );
};

export default SpotInfo;
