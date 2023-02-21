import { Box } from '@mui/system';
import React from 'react';

import SpotSearch from '../components/SpotSearch';

const HomePage = () => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <SpotSearch />
    </Box>
  );
};

export default HomePage;
