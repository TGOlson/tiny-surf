import React from 'react';
import { useParams } from 'react-router-dom';
import { Spot } from '../../shared/types';

// type Props = {
//   spots: Spot[],
//   selected: string,
// };

const SpotItem = (spot: Spot, selected: boolean) =>
  (<li key={spot.id} className={selected ? 'selected' : ''}>{spot.name}</li>);

const SpotList = () => {
  const params = useParams();
  console.log('params', params);

  return (
    <div className="spot-list">
      <ul>
        {/* {props.spots.map(spot => SpotItem(spot, spot.id === props.selected))} */}
      </ul>
    </div>
  );
};

export default SpotList;
