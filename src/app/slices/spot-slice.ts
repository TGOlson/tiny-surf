import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

import * as api from '../api';
import { Spot } from '../../shared/types';
import { LoadingState } from './types';

export type SelectionActionType = 'list-click' | 'search' | 'direct-nav';

export type SpotWithSearchString = Spot & {searchString: string};

type State = {
  spots: LoadingState<SpotWithSearchString[]>;
  selected: null | {
    slug: string,

    // components will use this to determine how to handle change in selection
    action: SelectionActionType,
  };
};

const initialState: State = {
  spots: {status: 'idle'},
  selected: null
};

export const fetchSpots = createAsyncThunk('spots/fetchSpots', api.fetchSpots);

export const spotSlice = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    spotSelected: (state, {payload}: PayloadAction<State['selected']>) => {
      state.selected = payload;
    }
  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchSpots.pending, (state: State) => {
        state.spots = {status: 'pending'};
      })
      .addCase(fetchSpots.fulfilled, (state: State, {payload}: PayloadAction<Spot[]>) => {
        const data = payload.map(spot => {
          const searchString = `${spot.name} ${spot.locationNamePath.slice(1).join(' ')}`.toLowerCase();
          return {...spot, searchString};
        });

        state.spots = {status: 'fulfilled', data};
      })
      .addCase(fetchSpots.rejected, (state: State, action) => {
        state.spots = {status: 'rejected', error: action.error.message ?? 'Unknown error'};
      });
  }
});

export const spotSelected = (payload: NonNullable<State['selected']>, navigate?: NavigateFunction) => {
  if(navigate) navigate(`/s/${payload.slug}`);
  return spotSlice.actions.spotSelected(payload);
};

export default spotSlice.reducer;
