import React, { useEffect, useState } from 'react';
import { groupBy } from 'ramda';
import { useNavigate } from 'react-router-dom';
import { GroupedVirtuoso, GroupedVirtuosoHandle, Virtuoso } from 'react-virtuoso';

import ListItemButton from '@mui/joy/ListItemButton';
import Card from '@mui/joy/Card';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import ListItemContent from '@mui/joy/ListItemContent';
import Stack from '@mui/joy/Stack';

import { Spot } from '../../shared/types';
import { useAppDispatch } from '../hooks';
import { SelectionActionType, spotSelected, SpotWithSearchString } from '../slices/spot-slice';
import { largeRegion } from '../utils';
import SpotListComponentMapping from './SpotListComponentMapping';
import SpotHeader from './SpotHeader';

type Params = {
  spots: SpotWithSearchString[],
  selected: Spot;
  selectionAction: SelectionActionType;
};

const SpotList = ({spots, selected, selectionAction}: Params) => {
  const listRef: React.RefObject<GroupedVirtuosoHandle> = React.useRef(null);
  const [filter, setFilter] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const filteredSpots = filter ? spots.filter(spot => spot.searchString.includes(filter.toLowerCase())) : spots;
  const selectedIndex = filteredSpots.findIndex(({id}) => id === selected.id);

  useEffect(() => {
    if (selectedIndex >= 0) listRef.current?.scrollToIndex({index: selectedIndex, align: 'center'});      
  }, [filter]);

  useEffect(() => {
    // if selection change is result of a list click, use smooth scrolling for nice UI
    // otherwise jump directly to the item (eg. if change is from search or direct nav)
    const behavior = selectionAction === 'list-click' ? 'smooth' : 'auto';

    if (selectedIndex >= 0) listRef.current?.scrollToIndex({index: selectedIndex, align: 'center', behavior});
  }, [selected]);

  const groups = groupBy(x => x, filteredSpots.map(x => {
    // TODO: hardcoded for testing CA/US spots, clean this up...
    return largeRegion(x).join(' / ').replace('United States', 'US');
  }));

  const groupLabels = Object.keys(groups);
  const groupCounts = Object.values(groups).map(x => x.length);
  
  const itemContent = (index: number) => {
    const spot = filteredSpots[index];

    if (!spot) throw new Error('Unexpected access error');
    
    const isSelected = spot.id === selected.id;

    const onClick = () => dispatch(spotSelected({slug: spot.slug, action: 'list-click'}, navigate));
    
    const backgroundColor = isSelected ? 'primary.100' : '';
    const fontWeight = isSelected ? 'normal' : '';

    return (
      <ListItemButton selected={isSelected} onClick={onClick} sx={{backgroundColor, fontWeight}}>
        <ListItemContent>
          <SpotHeader spot={spot} small hideLocation/>
        </ListItemContent>
      </ListItemButton>
    );
  };

  return (
    <Stack sx={{height: '100%', gap: 1}}>
      <Input placeholder="Search..." size="sm" onChange={(e) => setFilter(e.target.value)} />
      <Card variant="outlined" sx={{borderRadius: 'sm', height: '100%'}}>
        <GroupedVirtuoso
          ref={listRef}
          style={{ height: '100%' }} 
          // totalCount={filteredSpots.length}
          groupCounts={groupCounts} 
          components={SpotListComponentMapping}
          initialTopMostItemIndex={{index: selectedIndex, align: 'center'}}
          groupContent={index => <Typography noWrap level="body4" fontSize={10.5}>{groupLabels[index]}</Typography>}
          itemContent={itemContent} 
        />
      </Card>
    </Stack>
  );
};

export default SpotList;
