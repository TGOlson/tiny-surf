import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from './api';
import { Spot } from '../shared/types';

export const fetchSpots = createAsyncThunk('spots/fetchSpots', api.fetchSpots);


type LoadingState<T>
  = {status: 'idle'}
  | {status: 'pending'}
  | {status: 'fulfilled', data: T}
  | {status: 'rejected', error: string};


type State = {
  spots: LoadingState<Spot[]>;
  selected: string | null;
};

const initialState: State = {
  spots: {status: 'idle'},
  selected: null
};

export const spotSlice = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    spotSelected: (state, {payload}: PayloadAction<string>) => {
      state.selected = payload;
    }
  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchSpots.pending, (state: State) => {
        state.spots = {status: 'pending'};
      })
      .addCase(fetchSpots.fulfilled, (state: State, {payload}: PayloadAction<Spot[]>) => {
        state.spots = {status: 'fulfilled', data: payload};
      })
      .addCase(fetchSpots.rejected, (state: State, action) => {
        state.spots = {status: 'rejected', error: action.error.message ?? 'Unknown error'};
      });
  }
});

export const {spotSelected} = spotSlice.actions;

export default spotSlice.reducer;
