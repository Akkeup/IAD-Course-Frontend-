import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import services from './servicesSlice';

export const store = configureStore({ reducer: { auth, services }, middleware: (getDefaultMiddleware) => getDefaultMiddleware() });
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
