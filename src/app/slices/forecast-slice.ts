import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from '../api';
import { Forecast } from '../../shared/types';
import { LoadingState } from './types';

type State = {
  forecasts: {
    [key: string]: LoadingState<Forecast>;
  },
  day: 'today' | 'tomorrow' | 'next'
};

const initialState: State = {
  forecasts: {},
  day: 'today',
};

export const fetchForecast = createAsyncThunk('spots/fetchForecast', api.fetchForecast);

export const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {},
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

export default forecastSlice.reducer;
