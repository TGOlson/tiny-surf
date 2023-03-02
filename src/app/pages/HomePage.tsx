import React from 'react';
import Box from '@mui/joy/Box';

import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';

import SpotSearch from '../components/SpotSearch';

const HomePage = () => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '120px'}}>
      <FormControl>
        <SpotSearch autoFocus />
        <FormHelperText>Check the surf</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default HomePage;
