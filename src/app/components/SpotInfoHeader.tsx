import React from 'react';

import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SpotName from './SpotName';
import SpotLocation from './SpotLocation';

import { Spot } from '../../shared/types';
import { Box, IconButton } from '@mui/joy';

type SpotInfoHeaderProps = {
  spot: Spot;
};


const SpotInfoHeader = ({spot}: SpotInfoHeaderProps) => {
  return (
    <Card variant="outlined" sx={{borderRadius: 'sm'}}>
      <SpotName spot={spot} />
      <SpotLocation spot={spot} type={'small-region'} />
      <Divider sx={{mt: 1}} inset='none'/>
      <CardOverflow sx={{display: 'flex', justifyContent: 'center'}}>
        <IconButton sx={{"--IconButton-size": "20px"}} color="neutral" variant="plain">
          <ExpandMoreIcon />
        </IconButton>
      </CardOverflow>
    </Card>
  );
};

export default SpotInfoHeader;
