import React from 'react';

import Typography from '@mui/joy/Typography';


import { Spot } from "../../shared/types";
import { smallRegion } from '../utils';

export type LocationType 
 = 'small-region'
 | 'smallest-region';
//  | 'large-region';

type SpotLocationProps = {
  spot: Spot;
  small?: boolean;
  type: LocationType;
};

export const noLocation = () => null;
export const smallRegionLocation = (spot: Spot) => smallRegion(spot).join(', ');
export const smallestRegionLocation = (spot: Spot) => smallRegion(spot)[0];

const location = (type: LocationType, spot: Spot) => {
  switch (type) {
    case 'small-region': return smallRegion(spot).join(', ');
    case 'smallest-region': return smallRegion(spot)[0];
    // case 'large-region': return largeRegion(spot).join(' / ').replace('United States', 'US');
  }
};

const SpotLocation = ({spot, small = false, type}: SpotLocationProps) =>
  (
    <Typography 
      sx={{marginBottom: 0}} 
      level={small ? 'body3' : 'body2'} 
      textColor='text.secondary'
    >
      {location(type, spot)}
    </Typography>
  );

export default SpotLocation;
