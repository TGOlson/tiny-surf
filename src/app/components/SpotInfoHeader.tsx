import React from 'react';

import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import CardOverflow from '@mui/joy/CardOverflow';
import IconButton from '@mui/joy/IconButton';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SpotName from './SpotName';
import SpotLocation from './SpotLocation';

import { Spot } from '../../shared/types';

type SpotInfoHeaderProps = {
  spot: Spot;
};


const SpotInfoHeader = ({spot}: SpotInfoHeaderProps) => {
  return (
    <Card variant="outlined" sx={{borderRadius: 'xs'}}>
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
