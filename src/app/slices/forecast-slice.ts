import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import * as api from '../api';
import { Forecast } from '../../shared/types';
import { LoadingState } from './types';

type State = {
  forecasts: {
    [key: string]: LoadingState<Forecast>;
  },
  day: 0 | 1 | 2
};

const initialState: State = {
  forecasts: {},
  day: 0,
};

export const fetchForecast = createAsyncThunk('spots/fetchForecast', api.fetchForecast);

export const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    daySelected: (state, {payload}: PayloadAction<0 | 1 | 2>) => {
      state.day = payload;
    }
  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchForecast.pending, (state: State, {meta}) => {
        state.forecasts[meta.arg] = {status: 'pending'};
      })
      .addCase(fetchForecast.fulfilled, (state: State, {meta, payload}) => {
        state.forecasts[meta.arg] = {status: 'fulfilled', data: payload};
      })
      .addCase(fetchForecast.rejected, (state: State, {meta, error}) => {
        state.forecasts[meta.arg] = {status: 'rejected', error: error.message ?? 'Unknown error'};
      });
  }
});

export const {daySelected} = forecastSlice.actions;

export default forecastSlice.reducer;
