import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';

import SpotInfo from '../components/SpotInfo';
import SpotList from '../components/SpotList';
import { useAppDispatch, useAppSelector } from '../hooks';
import { spotSelected } from '../slices/spot-slice';

type SpotExplorerProps = {
  experiments?: boolean,
};

const SpotExplorer = ({experiments = false}: SpotExplorerProps) => {
  const params = useParams();
  const paramSlug = params.slug;

  if (!paramSlug) throw new Error('Unexpected url params');

  const dispatch = useAppDispatch();
  const spotsData = useAppSelector(st => st.spot.spots);
  const selected = useAppSelector(st => st.spot.selected);

  useEffect(() => {
    if (!selected) dispatch(spotSelected({slug: paramSlug, action: 'direct-nav'}));
  }, [selected, dispatch]);
  
  if (spotsData.status === 'idle' || spotsData.status === 'pending' || !selected) {
    return <p>Loading...</p>;
  }

  if (spotsData.status === 'rejected') {
    return <p>Error: {spotsData.error}</p>;
  }
  
  const spots = spotsData.data;

  const selectedSpot = spots.find(spot => spot.slug === selected.slug);
  
  if (!selectedSpot) {
    return <p>Unable to find spot {paramSlug}</p>;
  }

  return (
    <Stack direction="row" sx={{justifyContent: 'center', mt: 8, gap: 6}}>
      <Box sx={{width: 300, height: 490}}>
        <SpotList spots={spots} selected={selectedSpot} selectionAction={selected.action} />
      </Box>
      <Box sx={{width: 500}}>
        <SpotInfo spot={selectedSpot} experiments={experiments} />
      </Box>
    </Stack>
  );
};

export default SpotExplorer;
