import React, { Component } from 'react';
import { Region } from '../shared/types';
import { fetchRegion, SOUTH_SD_REGION_ID } from './api';

import "./App.css";
import Footer from './components/Footer';
import Header from './components/Header';
import SpotList from './components/SpotList';


type AppProps = Record<string, never>; // empty object
type AppState = {
  regions: Region[];
};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = { regions: [] };
  }

  componentDidMount() {
    void fetchRegion(SOUTH_SD_REGION_ID)
      .then(region => {
        console.log(region);
        this.setState({ regions: [region] });
      })
      .catch((err) => { throw err; });
  }

  render() {
    const {regions} = this.state;
    const spots = regions[0]?.spots;
    const selected = spots ? spots[0]?.id : null;

    console.log(spots, selected);

    return (
      <div>
        <Header/>
        {spots && selected ? <SpotList spots={spots} selected={selected} /> : 'loading spots...'}
        <Footer/>
      </div>
    );
  }
}

export default App;
