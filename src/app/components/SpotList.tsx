import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';


import { Spot } from '../../shared/types';
import { useAppDispatch } from '../hooks';
import { spotSelected } from '../spot-reducer';

type Params = {
  spots: Spot[],
  selected: Spot;
};


const renderRow = ({style, index, data}: ListChildComponentProps<{spots: Spot[], selected: Spot}>): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {spots, selected} = data;
  const spot = spots[index];

  if (!spot) throw new Error('Unexpected access error');

  const onClick = () => {
    navigate(`/s/${spot.slug}`);
    dispatch(spotSelected(spot.slug));
  };

  const isSelected = spot.id === selected.id;

  return (
   <ListItem dense style={style} key={index} component="div" disablePadding>
      <ListItemButton selected={isSelected} onClick={onClick} >
        <ListItemText primary={spot.name} />
      </ListItemButton>
    </ListItem>
  );
 };

const SpotList = ({spots, selected}: Params) => {

  const listRef: React.RefObject<FixedSizeList> = React.createRef();

  // const [firstRender, setFirstRender] = useState(true);

  const initialScrollOffset = -1 * spots.findIndex(spot => spot.id === selected.id);
  console.log(initialScrollOffset);


  return (
    <Box
      sx={{ width: '100%', height: 600, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        ref={listRef}
        height={600}
        width={'100%'}
        itemSize={46}
        itemCount={spots.length}
        overscanCount={5}
        itemData={{spots, selected}}
        initialScrollOffset={initialScrollOffset}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );

    // <div className="spot-list">
    //   <ul>
    //     {spots.map(spot => (
    //       <li key={spot.id}>
    //         <Link 
    //           to={"../" + spot.slug} 
    //           onClick={() => dispatch(spotSelected(spot.slug))} 
    //           relative="path"
    //           className={selected?.id === spot.id ? 'selected' : ''}
    //         >
    //           {spot.name}
    //         </Link>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
};

export default SpotList;
