// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import user from './user';

export const store = configureStore({
  reducer: {
    user: user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
