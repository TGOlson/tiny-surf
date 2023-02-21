import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpotInfo from '../components/SpotInfo';
import SpotList from '../components/SpotList';

import { useAppDispatch, useAppSelector } from '../hooks';
import { spotSelected } from '../slices/spot-slice';

const SpotExplorer = () => {
  const params = useParams();
  const paramSlug = params.slug;

  if (!paramSlug) throw new Error('Unexpected url params');

  const dispatch = useAppDispatch();
  const spotsData = useAppSelector(st => st.spot.spots);
  const selected = useAppSelector(st => st.spot.selected);

  useEffect(() => {
    if (!selected) dispatch(spotSelected(paramSlug));
  }, [selected, dispatch]);
  
  if (spotsData.status === 'idle' || spotsData.status === 'pending' ) {
    return <p>Loading...</p>;
  }

  if (spotsData.status === 'rejected') {
    return <p>Error: {spotsData.error}</p>;
  }
  
  const spots = spotsData.data;

  const selectedSpot = spots.find(spot => spot.slug === selected);
  
  if (!selectedSpot) {
    return <p>Unable to find spot {paramSlug}</p>;
  }

  return (
    <Stack direction="row" justifyContent="center" spacing={2}>
      <Box sx={{width: 280}}>
        <SpotList spots={spots} selected={selectedSpot} />
      </Box>
      <Box sx={{width: 400}}>
        <SpotInfo spot={selectedSpot} />
      </Box>
    </Stack>
  );
};

export default SpotExplorer;
