import React from 'react';
import { Autocomplete, createFilterOptions, TextField, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../hooks';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { spotSelected } from '../slices/spot-slice';
import { smallRegion } from '../utils';

type SpotSearchParams = {
  small?: boolean
};

const SpotSearch = ({small}: SpotSearchParams) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const spotsData = useAppSelector(st => st.spot.spots);
  const spots = spotsData.status === 'fulfilled' ? spotsData.data : [];
  const spotsWithSearchString = spots.map(spot => ({...spot, searchString: `${spot.name} ${spot.locationNamePath.join(' ')}`}));

  return (
    <Autocomplete
      sx={{ width: small ? 260 : 360 }}
      options={spotsWithSearchString}
      clearOnEscape
      openOnFocus={false}
      popupIcon={null}
      noOptionsText="No spots found..."
      getOptionLabel={(spot) => typeof spot === 'string' ? spot : spot.name}
      onChange={(_event, value, reason) => {
        console.log('onchange', reason);
        if (reason === 'selectOption' && value && typeof value === 'object' && 'slug' in value) {
          dispatch(spotSelected(value.slug, navigate));
        }
      }}
      isOptionEqualToValue={(option, value) => {
        return option.id === value.id;
      }}
      filterOptions={createFilterOptions({
        stringify: (spot) => spot.searchString
      })}
      renderOption={(props, spot) => (
        <Box component="li" {...props}>
          <Box>
            <Typography paragraph sx={{marginBottom: 0}} variant={small ? 'body1' : 'h6'}>{spot.name}</Typography>
            <Typography paragraph sx={{marginBottom: 0}} variant="caption" color="text.secondary">{smallRegion(spot).join(', ')}</Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField 
          {...params} 
          size={small ? 'small' : 'medium'}
          variant="outlined" 
          placeholder="Search" 
        />
      )}
    />
  );
};

export default SpotSearch;
