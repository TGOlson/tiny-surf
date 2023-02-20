import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, createFilterOptions, InputAdornment, TextField } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../hooks';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { spotSelected } from '../slices/spot-slice';

type SpotSearchParams = {
  small?: boolean
};

const SpotSearch = ({small}: SpotSearchParams) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const spotsData = useAppSelector(st => st.spot.spots);
  const spots = spotsData.status === 'fulfilled' ? spotsData.data : [];

  return (
    <Autocomplete
      freeSolo
      sx={{ width: 300 }}
      options={spots}
      getOptionLabel={(spot) => typeof spot === 'string' ? spot : spot.name}
      onChange={(_event, value, reason) => {
        if (reason === 'selectOption' && value && typeof value === 'object' && 'slug' in value) {
          navigate(`/s/${value.slug}`);
          dispatch(spotSelected(value.slug));
        }
      }}
      filterOptions={createFilterOptions({
        stringify: (spot) => JSON.stringify(spot)
      })}
      renderOption={(props, spot) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          {spot.name} ({spot.locationNamePath.join(' / ')})
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
