import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import session from 'reducers/sessionSlice';
import toast from 'reducers/toastSlice';

const store = configureStore({
  reducer: {
    toast,
    session,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

type AppSelector = TypedUseSelectorHook<RootState>;
export const useAppSelector: AppSelector = useSelector;
