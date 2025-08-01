import { configureStore } from '@reduxjs/toolkit';
import empresaReducer from './empresaSlice';
import authReducer from './authSlice';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    empresa: empresaReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});
