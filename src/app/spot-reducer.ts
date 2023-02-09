import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Spot } from '../shared/types';

type State = {
  spots: Spot[]
};

const initialState: State = {
  spots: []
};

export const spotSlice = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    addSpot: (state: State, {payload}: PayloadAction<Spot>) => {
      state.spots.push(payload);
    },
    addSpots: (state: State, {payload}: PayloadAction<Spot[]>) => {
      state.spots = state.spots.concat(payload);
    },
  }
});

export const {addSpot} = spotSlice.actions;

export default spotSlice.reducer;
