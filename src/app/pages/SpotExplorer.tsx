import React from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import { Spot } from '../../shared/types';
import { spotLoader } from '../loaders';

const SpotItem = (spot: Spot) =>(
  <li key={spot.id}>
    <NavLink to={"../" + spot.id} relative="path">{spot.name}</NavLink>
  </li>
);

const SpotExplorer = () => {
  // TODO: this typing is gnarly, refactor to a better place
  const {spots} = useLoaderData() as Awaited<ReturnType<typeof spotLoader>>;
  console.log('spots', spots);

  return (
    <div className="spot-list">
      <ul>
        {spots.map(spot => SpotItem(spot))}
      </ul>
    </div>
  );
};

export default SpotExplorer;
