// import React from 'react';
// import { Link } from 'react-router-dom';

// import { Spot } from '../../shared/types';
// import { useAppDispatch } from '../hooks';
// import { spotSelected } from '../spot-reducer';

// type Params = {
//   spots: Spot[],
//   selected: Spot | null;
// };

// const SpotList = ({spots, selected}: Params) => {
//   const dispatch = useAppDispatch();

//   return (
//     <div className="spot-list">
//       <ul>
//         {spots.map(spot => (
//           <li key={spot.id}>
//             <Link 
//               to={"../" + spot.slug} 
//               onClick={() => dispatch(spotSelected(spot.slug))} 
//               relative="path"
//               className={selected?.id === spot.id ? 'selected' : ''}
//             >
//               {spot.name}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpotList;
