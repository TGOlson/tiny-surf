import React, { useEffect } from 'react';
import { groupBy } from 'ramda';
import { useNavigate } from 'react-router-dom';
import { GroupedVirtuoso, GroupedVirtuosoHandle, ItemProps, ListProps, GroupProps } from 'react-virtuoso';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';

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

  useEffect(() => {
    const index = spots.findIndex(spot => spot.id === selected.id);
    listRef.current?.scrollIntoView({index, align: 'center'});
  }, [listRef.current, selected]);

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

    const onClick = () => dispatch(spotSelected(spot.slug, navigate));
    
    return (
      <ListItemButton selected={isSelected} onClick={onClick}>
        <Typography noWrap>{spot.name}</Typography>
      </ListItemButton>
    );
  };

  return (
    <Card variant="outlined">
      <GroupedVirtuoso 
        ref={listRef}
        style={{ height }} 
        groupCounts={groupCounts} 
        components={MUIComponents}
        initialTopMostItemIndex={{index, align: 'center'}}
        groupContent={index => <Typography noWrap>{groupLabels[index]}</Typography>}
        itemContent={itemContent} 
      />
    </Card>
  );
};

// kind of clunky mapping of different component libraries
// mostly taken from: https://virtuoso.dev/material-ui-endless-scrolling/
const MUIComponents = {
  List: React.forwardRef(function MUIListComponent({style, children}: ListProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
      <List 
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
      <ListItem component="div" {...props} style={{ margin: 0, paddingLeft: '16px' }}>
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
