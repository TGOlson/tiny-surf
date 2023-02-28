import React from 'react';

import Typography from '@mui/joy/Typography';

import { Spot } from "../../shared/types";

type SpotNameProps = {
  spot: Spot;
  small?: boolean;
};

const SpotName = ({spot, small = false}: SpotNameProps) =>
  (
    <Typography 
      sx={{marginBottom: 0}} 
      level={small ? 'body1' : 'h6'} 
      fontSize={small ? 'sm' : ''}
    >
      {spot.name}
    </Typography>
  );

export default SpotName;
