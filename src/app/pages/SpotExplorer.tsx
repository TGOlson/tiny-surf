import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpotInfo from '../components/SpotInfo';
import SpotList from '../components/SpotList';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSpots, spotSelected } from '../slices/spot-slice';

const SpotExplorer = () => {
  const params = useParams();
  const paramSlug = params.slug;

  if (!paramSlug) throw new Error('Unexpected url params');

  const dispatch = useAppDispatch();
  const spotsData = useAppSelector(st => st.spot.spots);
  const selected = useAppSelector(st => st.spot.selected);

  useEffect(() => {
    if (spotsData.status === 'idle') void dispatch(fetchSpots());
  }, [spotsData.status, dispatch]);

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
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={6} sm={4}>
        <SpotList spots={spots} selected={selectedSpot} />
      </Grid>
      <Grid item xs={6} sm={5}>
        <SpotInfo spot={selectedSpot} />
      </Grid>
    </Grid>
  );
};

export default SpotExplorer;
