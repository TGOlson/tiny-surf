import { configureStore } from '@reduxjs/toolkit';
import regionReducer from './region-reducer';
import spotReducer from './spot-reducer';

export default configureStore({
  reducer: {
    spot: spotReducer,
    region: regionReducer,
  },
  devTools: true,
});
