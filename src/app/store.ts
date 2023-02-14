import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import spotReducer from './slices/spot-slice';
import forecastReducer from './slices/forecast-slice';

const store = configureStore({
  reducer: {
    spot: spotReducer,
    forecast: forecastReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
