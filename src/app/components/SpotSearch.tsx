import React from 'react';
import { useNavigate } from 'react-router-dom';

import Autocomplete, {createFilterOptions} from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import Typography from '@mui/joy/Typography';
import ListItemContent from '@mui/joy/ListItemContent';

import SearchIcon from '@mui/icons-material/Search';

import { useAppDispatch, useAppSelector } from '../hooks';
import { spotSelected } from '../slices/spot-slice';
import { smallRegion } from '../utils';

type SpotSearchParams = {
  small?: boolean,
  autoFocus?: boolean,
};

const SpotSearch = ({small, autoFocus}: SpotSearchParams) => {
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
      sx={{ width: small ? 260 : 360 }}
      size={small ? 'sm' : 'lg'}
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
        <AutocompleteOption {...props}>
          <ListItemContent>
            <Typography sx={{marginBottom: 0}} level={small ? 'body1' : 'h6'}>{spot.name}</Typography>
            <Typography sx={{marginBottom: 0}} level="body3" textColor='text.secondary'>{smallRegion(spot).join(', ')}</Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}

    />
  );
};

export default SpotSearch;
