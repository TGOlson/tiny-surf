import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SpotSearch from './SpotSearch';

const Header = () => (
  <AppBar position="static" elevation={0} color="inherit">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Tiny Surf
      </Typography>
      <SpotSearch small />
    </Toolbar>
  </AppBar>
);

export default Header;
