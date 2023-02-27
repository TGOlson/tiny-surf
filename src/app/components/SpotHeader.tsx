import React from 'react';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';


import { Spot } from "../../shared/types";
import { smallRegion } from '../utils';
type SpotHeaderProps = {
  spot: Spot;
  small?: boolean;
  hideLocation?: boolean;
};

const SpotHeader = ({spot, small = false, hideLocation = false}: SpotHeaderProps) => {

  const location = smallRegion(spot).join(', ');

  return (
    <Box>
      <Typography sx={{marginBottom: 0}} level={small ? 'body1' : 'h6'} fontSize={small ? 'sm' : ''}>{spot.name}</Typography>
      { hideLocation ? null : <Typography sx={{marginBottom: 0}} level={small ? 'body3' : 'body2'} textColor='text.secondary'>{location}</Typography>}
    </Box>
  );
};

export default SpotHeader;
