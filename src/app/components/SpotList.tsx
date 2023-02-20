import React from 'react';
import { useNavigate } from 'react-router-dom';

import { List, ListSubheader, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { GroupedVirtuoso, GroupedVirtuosoHandle, ItemProps, ListProps, GroupProps } from 'react-virtuoso';
import { groupBy } from 'ramda';

import { Spot } from '../../shared/types';
import { useAppDispatch } from '../hooks';
import { spotSelected } from '../slices/spot-slice';
import { largeRegion } from '../utils';

type Params = {
  spots: Spot[],
  selected: Spot;
};

const SpotList = ({spots, selected}: Params) => {
  const listRef: React.RefObject<GroupedVirtuosoHandle> = React.useRef(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const index = spots.findIndex(spot => spot.id === selected.id);

  const height = 504; // 36 per * 14 items
  const groups = groupBy(x => x, spots.map(x => {
    // TODO: hardcoded for testing CA/US spots, clean this up...
    return largeRegion(x).join(' / ').replace('United States', 'US');
  }));

  const groupLabels = Object.keys(groups);
  const groupCounts = Object.values(groups).map(x => x.length);

  const itemContent = (index: number) => {
    const spot = spots[index];

    if (!spot) throw new Error('Unexpected access error');
    
    const isSelected = spot.id === selected.id;

    const onClick = () => {
      navigate(`/s/${spot.slug}`);
      dispatch(spotSelected(spot.slug));
    };
    
    return (
      <ListItemButton selected={isSelected} onClick={onClick}>
          <ListItemText primaryTypographyProps={{noWrap: true}}>
            {spot.name}
          </ListItemText>
        </ListItemButton>
    );
  };

  return (
    <Paper>
      <GroupedVirtuoso 
        ref={listRef}
        style={{ height }} 
        groupCounts={groupCounts} 
        components={MUIComponents}
        initialTopMostItemIndex={{index, align: 'center'}}
        groupContent={index => <Typography variant="inherit" noWrap>{groupLabels[index]}</Typography>}
        itemContent={itemContent} />
      </Paper>
  );
};

// kind of clunky mapping of different component libraries
// mostly taken from: https://virtuoso.dev/material-ui-endless-scrolling/
const MUIComponents = {
  List: React.forwardRef(function MUIListComponent({style, children}: ListProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
      <List 
        dense
        style={{ padding: 0, ...style, margin: 0 }} 
        component="div" 
        ref={ref}
      >
        {children}
      </List>
    );
  }),

  Item: ({ children, ...props }: ItemProps<unknown>) => {
    return (
      <ListItem disablePadding component="div" {...props} style={{ margin: 0, paddingLeft: '16px' }}>
        {children}
      </ListItem>
    );
  },

  Group: ({ children, style, ...props }: GroupProps) => {
    return (
      <ListSubheader
        component="div"
        {...props}
        style={{
          ...style,
          backgroundColor: 'white',
        }}
      >
        {children}
      </ListSubheader>
    );
  },
};

export default SpotList;
