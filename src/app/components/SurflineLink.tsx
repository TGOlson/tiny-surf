import React from 'react';
import Link from '@mui/joy/Link';

import { Spot } from '../../shared/types';

type SurflineLinkProps = {
  spot: Spot
};

const SurflineLink = ({spot}: SurflineLinkProps) => {

  const href = `https://www.surfline.com/surf-report/spot/${spot.id}`;

  return (
    <Link slotProps={{root: {href, target: '_blank', rel: 'noreferrer'}}} level="body4">
      Surfline forecast
    </Link>
  );
};

export default SurflineLink;
