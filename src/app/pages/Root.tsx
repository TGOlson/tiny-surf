import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Stack from '@mui/system/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSpots } from '../slices/spot-slice';

const Root = () => {
  const dispatch = useAppDispatch();
  const spotsData = useAppSelector(st => st.spot.spots);
  const location = useLocation();

  // hacky way to hide navbar search when on home page
  const hideSearch = location.pathname === '/';

  // Fetch spots from root component, as all other pages need this data
  // TODO: is there a better place to do this root loading?
  useEffect(() => {
    if (spotsData.status === 'idle') void dispatch(fetchSpots());
  }, [spotsData.status, dispatch]);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Stack spacing={2} sx={{height: '100vh', backgroundColor: '#e7ebf0'}}>
        <Header hideSearch={hideSearch} />
        <Outlet />
      </Stack>
    </CssVarsProvider>
  );
};

export default Root;
