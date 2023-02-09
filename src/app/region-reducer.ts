import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region } from '../shared/types';

type State = {
  regions: Region[]
};

const initialState: State = {
  regions: []
};

export const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    addRegion: (state: State, {payload}: PayloadAction<Region>) => {
      console.log('region reducer', payload);
      state.regions.push(payload);
    },
  }
});

export const {addRegion} = regionSlice.actions;

export default regionSlice.reducer;
