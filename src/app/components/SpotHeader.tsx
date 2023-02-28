import React from 'react';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';


import { Spot } from "../../shared/types";
import { smallRegion } from '../utils';
type SpotHeaderProps = {
  spot: Spot;
  small?: boolean;
  locationSubheader: (spot: Spot) => string | null;
};

export const noLocation = () => null;
export const smallRegionLocation = (spot: Spot) => smallRegion(spot).join(', ');
export const smallestRegionLocation = (spot: Spot) => smallRegion(spot)[0];

const SpotHeader = ({spot, small = false, locationSubheader}: SpotHeaderProps) => {
  return (
    <Box>
      <Typography sx={{marginBottom: 0}} level={small ? 'body1' : 'h6'} fontSize={small ? 'sm' : ''}>{spot.name}</Typography>
      <Typography sx={{marginBottom: 0}} level={small ? 'body3' : 'body2'} textColor='text.secondary'>{locationSubheader(spot)}</Typography>
    </Box>
  );
};

export default SpotHeader;
