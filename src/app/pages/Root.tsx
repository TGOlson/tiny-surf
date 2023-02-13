import { CssBaseline, Grid } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

// import Footer from '../components/Footer';
import Header from '../components/Header';

const Root = () => {
  return (
    <React.Fragment>
      <CssBaseline />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </React.Fragment>
  );
  // <Footer />
};

export default Root;
