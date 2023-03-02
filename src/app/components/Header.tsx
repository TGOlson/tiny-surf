import React from 'react';
import { useNavigate } from 'react-router-dom';

import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

const Header = () => {
  const navigate = useNavigate();

  const onClick = () => navigate('/');

  return (
    <Sheet color="neutral" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Button onClick={onClick} size="sm" variant="plain">TINY SURF</Button>
    </Sheet>
  );
};

export default Header;
