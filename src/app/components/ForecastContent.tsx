import React from 'react';
import { DateTime }  from 'luxon';
import { Units } from 'surfline/forecasts/types';

import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AirIcon from '@mui/icons-material/Air';
import SurfingIcon from '@mui/icons-material/Surfing';
import WavesIcon from '@mui/icons-material/Waves';

import WaveChart from './charts/WaveChart';
import TideChart from './charts/TideChart';
import WindChart from './charts/WindChart';
import RatingChart from './charts/RatingChart';
import RatingRadarChart from './charts/RatingRadarChart';

import ForecastCard from './ForecastCard';
import { RatingDetails, TideDetails, WaveDetails, WindDetails } from '../../shared/types';

type ForecastContentProps = {
  ratings: (RatingDetails & {datetime: DateTime})[] | undefined,
  waves: (WaveDetails & {datetime: DateTime})[],
  winds: (WindDetails & {datetime: DateTime})[],
  tides: (TideDetails & {datetime: DateTime})[],
  units: Units,
  experiments?: boolean;
};


const ForecastContent = ({ratings, waves, winds, tides, units, experiments = false}: ForecastContentProps) => {
  const content = (
    <React.Fragment>
      <Grid xs={6}>
        <ForecastCard title='RATING' icon={<AutoAwesomeIcon />}>
          {ratings ? <RatingChart type="bar" data={ratings} /> : <Typography level="body4">n/a</Typography>}
        </ForecastCard>
      </Grid>

      <Grid xs={6}>
        <ForecastCard title={`WAVE (${units.waveHeight.toLowerCase()}.)`} icon={<SurfingIcon />}>
          <WaveChart data={waves} units={units} />
        </ForecastCard>
      </Grid>

      <Grid xs={6}>
        <ForecastCard title={`WIND (${units.windSpeed.toLowerCase()}.)`} icon={<AirIcon />}>
          <WindChart data={winds} units={units}/>
        </ForecastCard>          
      </Grid>
      
      <Grid xs={6}>
        <ForecastCard title={`TIDE (${units.tideHeight.toLowerCase()}.)`} icon={<WavesIcon />}>
          <TideChart data={tides} units={units}/>
        </ForecastCard>
      </Grid>
    </React.Fragment>
  );

  const experimentContent = (
    <React.Fragment>
      <Grid xs={6}>
        <ForecastCard title={`WAVE (${units.waveHeight.toLowerCase()}.)`} icon={<SurfingIcon />}>
          {ratings ? <RatingRadarChart ratings={ratings} waves={waves} /> : <Typography level="body4">n/a</Typography>}
        </ForecastCard>
      </Grid>
      <Grid xs={6}>
        <ForecastCard title={`WAVE (${units.waveHeight.toLowerCase()}.)`} icon={<SurfingIcon />}>
          {ratings ? <RatingRadarChart ratings={ratings} waves={waves} /> : <Typography level="body4">n/a</Typography>}
        </ForecastCard>
      </Grid>
    </React.Fragment>
  );

  return (
    <Grid container spacing={2}>
      {experiments ? experimentContent : content}
    </Grid>
  );
};

export default ForecastContent;
