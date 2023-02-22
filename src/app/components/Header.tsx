import React from 'react';
import { useNavigate } from 'react-router-dom';

import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

import SpotSearch from './SpotSearch';

type HeaderProps = {
  hideSearch?: boolean
};

const Header = ({hideSearch = false}: HeaderProps) => {
  const navigate = useNavigate();

  const onClick = () => navigate('/');

  return (
    <Sheet color="neutral" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Button onClick={onClick} size="sm" variant="plain">TINY SURF</Button>
      {hideSearch ? null : <SpotSearch small />}
    </Sheet>
  );
};

export default Header;
