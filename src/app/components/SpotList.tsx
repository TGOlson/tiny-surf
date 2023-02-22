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
import { SelectionActionType, spotSelected } from '../slices/spot-slice';
import { largeRegion } from '../utils';
import { ListItemContent } from '@mui/joy';

type Params = {
  spots: Spot[],
  selected: Spot;
  selectionAction: SelectionActionType;
};

const SpotList = ({spots, selected, selectionAction}: Params) => {
  const listRef: React.RefObject<GroupedVirtuosoHandle> = React.useRef(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const spotIndex = (spot: Spot): number => spots.findIndex(({id}) => id === spot.id);

  useEffect(() => {
    // if selection change is result of a list click, use smooth scrolling for nice UI
    // otherwise jump directly to the item (eg. if change is from search or direct nav)
    const behavior = selectionAction === 'list-click' ? 'smooth' : 'auto';

    const index = spotIndex(selected);
    listRef.current?.scrollToIndex({index, align: 'center', behavior});
  }, [listRef.current, selected]);

  const index = spotIndex(selected);

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

    const onClick = () => dispatch(spotSelected({slug: spot.slug, action: 'list-click'}, navigate));
    
    const backgroundColor = isSelected ? 'primary.100' : '';
    const fontWeight = isSelected ? 'normal' : '';

    return (
      <ListItemButton selected={isSelected} onClick={onClick} sx={{backgroundColor, fontWeight}}>
        <ListItemContent>
          <Typography noWrap level="body1" fontSize="sm">{spot.name}</Typography>
        </ListItemContent>
      </ListItemButton>
    );
  };

  return (
    <Card variant="outlined" sx={{borderRadius: 'sm', height: '100%'}}>
      <GroupedVirtuoso 
        ref={listRef}
        style={{ height: '100%' }} 
        groupCounts={groupCounts} 
        components={MUIComponents}
        initialTopMostItemIndex={{index, align: 'center'}}
        groupContent={index => <Typography noWrap level="body4" fontSize={10.5}>{groupLabels[index]}</Typography>}
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
        size="sm"
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
      <ListItem component="div" {...props} style={{ margin: 0 }}>
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
