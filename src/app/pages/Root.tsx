import { CssBaseline, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

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
    <React.Fragment>
      <CssBaseline />

      <Grid container spacing={2} className='content'>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Root;
