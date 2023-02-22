import React from 'react';

import Box from '@mui/system/Box';
import Typography from '@mui/joy/Typography';

import SpotSearch from './SpotSearch';

type HeaderProps = {
  hideSearch?: boolean
};

const Header = ({hideSearch = false}: HeaderProps) => (
  <Box>
    <Typography level="h6" component="div" sx={{ flexGrow: 1 }}>
      Tiny Surf
    </Typography>
    {hideSearch ? null : <SpotSearch small />}
  </Box>
);

export default Header;
