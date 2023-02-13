import React from 'react';
import { Outlet } from 'react-router-dom';

// import Footer from '../components/Footer';
import Header from '../components/Header';

const Root = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
  // <Footer />
};

export default Root;
