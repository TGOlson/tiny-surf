import React from 'react';
import { useNavigate } from 'react-router-dom';

import Autocomplete, {createFilterOptions} from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';

import SearchIcon from '@mui/icons-material/Search';

import { useAppDispatch, useAppSelector } from '../hooks';
import { spotSelected } from '../slices/spot-slice';
import SpotLocation from './SpotLocation';

type SpotSearchParams = {
  autoFocus?: boolean,
};

const SpotSearch = ({autoFocus}: SpotSearchParams) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const spotsData = useAppSelector(st => st.spot.spots);
  const spots = spotsData.status === 'fulfilled' ? spotsData.data : [];
  const spotsWithSearchString = spots.map(spot => ({...spot, searchString: `${spot.name} ${spot.locationNamePath.join(' ')}`}));

  return (
    <Autocomplete
      autoFocus={autoFocus}
      placeholder="Search"
      clearOnEscape
      noOptionsText="No spots found"
      startDecorator={<SearchIcon />}
      popupIcon={null}
      sx={{ width: 360 }}
      size={'lg'}
      options={spotsWithSearchString}
      getOptionLabel={(spot) => typeof spot === 'string' ? spot : spot.name}
      onChange={(_event, value, reason) => {
        console.log('onchange', reason);
        if (reason === 'selectOption' && value && typeof value === 'object' && 'slug' in value) {
          dispatch(spotSelected({slug: value.slug, action: 'search'}, navigate));
        }
      }}
      isOptionEqualToValue={(option, value) => {
        return option.id === value.id;
      }}
      filterOptions={createFilterOptions({
        stringify: (spot) => spot.searchString
      })}
      renderOption={(props, spot) => (
        <AutocompleteOption key={spot.slug} {...props}>
          <ListItemContent>
            <Typography sx={{marginBottom: 0}} level='h6'>{spot.name}</Typography>
            <SpotLocation spot={spot} type={'small-region'} />
          </ListItemContent>
        </AutocompleteOption>
      )}

    />
  );
};

export default SpotSearch;
