import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpotList from '../components/SpotList';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSpots, spotSelected } from '../spot-reducer';

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

  const selectedSpot = spots.find(spot => spot.slug === paramSlug);
  
  if (!selectedSpot) {
    return <p>Unable to find spot {paramSlug}</p>;
  }

  const location = selectedSpot.locationNamePath.slice(2).join(' ');

  return (
    <div className="spot-list">
      <h4>{location}</h4>
      <SpotList spots={spots} selected={selectedSpot} />
    </div>
  );
};

export default SpotExplorer;
