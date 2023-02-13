import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSpots, spotSelected } from '../spot-reducer';

const SpotExplorer = () => {
  const dispatch = useAppDispatch();
  const spotsData = useAppSelector(st => st.spot.spots);

  useEffect(() => {
    if (spotsData.status === 'idle') void dispatch(fetchSpots());
  }, [spotsData.status, dispatch]);

  if (spotsData.status === 'idle' || spotsData.status === 'pending' ) {
    return <p>Loading...</p>;
  }

  if (spotsData.status === 'rejected') {
    return <p>Error: {spotsData.error}</p>;
  }

  const spots = spotsData.data;

  return (
    <div className="spot-list">
      <ul>
        {spots.map(spot => (
          <li key={spot.id}>
            <NavLink 
              to={"../" + spot.slug} 
              onClick={() => dispatch(spotSelected(spot.slug))} 
              relative="path"
            >
              {spot.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotExplorer;
