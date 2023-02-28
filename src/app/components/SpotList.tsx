import React, { useEffect, useState } from 'react';
import { groupBy } from 'ramda';
import { useNavigate } from 'react-router-dom';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';

import ListItemButton from '@mui/joy/ListItemButton';
import Card from '@mui/joy/Card';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import ListItemContent from '@mui/joy/ListItemContent';
import Stack from '@mui/joy/Stack';
import ClearIcon from '@mui/icons-material/ClearRounded';
import Button from '@mui/joy/Button';

import { Spot } from '../../shared/types';
import { useAppDispatch } from '../hooks';
import { SelectionActionType, spotSelected, SpotWithSearchString } from '../slices/spot-slice';
import { largeRegion } from '../utils';
import SpotListComponentMapping from './SpotListComponentMapping';
import SpotName from './SpotName';
import SpotLocation from './SpotLocation';
import { get } from '../../shared/util';

type SpotListProps = {
  spots: SpotWithSearchString[],
  selected: Spot,
  selectionAction: SelectionActionType,
};

type SpotListFilterProps = {
  filter: string,
  setFilter: (filter: string) => void,
};

type SpotListItemContentProps = {
  spot: Spot,
  isSelected: boolean,
};

const SpotListFilter = ({filter, setFilter}: SpotListFilterProps) => {
  const button = (
    <Button variant='plain' color='neutral' size='sm' sx={{padding: '4px'}} onClick={() => setFilter('')}>
      <ClearIcon sx={{width: '16px', height: '16px'}} fontSize='medium' color="secondary" />
    </Button>
  );

  return (
    <Input 
      placeholder="Search..." 
      value={filter}
      size="sm" 
      onChange={(e) => setFilter(e.target.value)} 
      endDecorator={filter.length > 0 ? button : null}
    />
  );
  };

const SpotListItemContent = ({spot, isSelected}: SpotListItemContentProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClick = () => dispatch(spotSelected({slug: spot.slug, action: 'list-click'}, navigate));
    
  const backgroundColor = isSelected ? 'primary.100' : '';
  const fontWeight = isSelected ? 'normal' : '';

  return (
    <ListItemButton selected={isSelected} onClick={onClick} sx={{backgroundColor, fontWeight}}>
      <ListItemContent>
        <SpotName spot={spot} small />
        <SpotLocation spot={spot} small type={'smallest-region'} />
      </ListItemContent>
    </ListItemButton>
  );
};

const SpotList = ({spots, selected, selectionAction}: SpotListProps) => {
  const listRef: React.RefObject<GroupedVirtuosoHandle> = React.useRef(null);
  const [filter, setFilter] = useState('');

  const filteredSpotsAll = filter ? spots.filter(spot => spot.searchString.includes(filter.toLowerCase())) : spots;

  // TODO: move to reducer or server
  const groups = groupBy(spot => {
    // TODO: hardcoded for testing CA/US spots, clean this up...
    return largeRegion(spot).join(' / ').replace('United States', 'US');
  }, filteredSpotsAll);

  const groupLabels = Object.keys(groups);
  const groupValues = Object.values(groups);

  const groupCounts = groupValues.map(x => x.length);
  const filteredSpots = groupValues.flat();

  const selectedIndex = filteredSpots.findIndex(({id}) => id === selected.id);

  useEffect(() => {
    if (selectedIndex >= 0 && filter === '') {
      listRef.current?.scrollToIndex({index: selectedIndex, align: 'center'});      
    }
  }, [filter]);

  useEffect(() => {
    // if selection change is result of a list click, use smooth scrolling for nice UI
    // otherwise jump directly to the item (eg. if change is from search or direct nav)
    const behavior = selectionAction === 'list-click' ? 'smooth' : 'auto';

    if (selectedIndex >= 0) listRef.current?.scrollToIndex({index: selectedIndex, align: 'center', behavior});
  }, [selected]);

  const itemContent = (index: number) => {
    const spot = get(index, filteredSpots);
    const isSelected = spot.id === selected.id;

    return <SpotListItemContent spot={spot} isSelected={isSelected} />;
  };

  return (
    <Stack sx={{height: '100%', gap: 1}}>
      <SpotListFilter filter={filter} setFilter={setFilter} />
      <Card variant="outlined" sx={{borderRadius: 'sm', height: '100%'}}>
        <GroupedVirtuoso
          ref={listRef}
          style={{ height: '100%' }} 
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
