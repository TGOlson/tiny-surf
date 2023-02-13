import React from 'react';

import { Spot } from '../../shared/types';

type Params = {
  spot: Spot | null;
};

const SpotInfo = ({spot}: Params) => {
  return (
    <p>{spot ? spot.name : 'Please select a spot!'}</p>
  );
};

export default SpotInfo;
