import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSpots } from '../slices/spot-slice';

const Root = () => {
  const dispatch = useAppDispatch();
  const spotsData = useAppSelector(st => st.spot.spots);

  // Fetch spots from root component, as all other pages need this data
  // TODO: is there a better place to do this root loading?
  useEffect(() => {
    if (spotsData.status === 'idle') void dispatch(fetchSpots());
  }, [spotsData.status, dispatch]);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Stack sx={{height: '100vh', backgroundColor: '#e7ebf0'}}>
        <Header hideSearch />
        <Outlet />
      </Stack>
    </CssVarsProvider>
  );
};

export default Root;
