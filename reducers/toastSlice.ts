import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Toast = {
  type: 'success' | 'danger';
  message: string;
};

type initialState = { toasts: Toast[] };

export const toastSlice = createSlice({
  name: 'toasts',
  initialState: <initialState>{
    toasts: [],
  },
  reducers: {
    add: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload);
    },
    pop: (state) => {
      state.toasts.shift();
    }
  },
});

export const { add, pop } = toastSlice.actions;

export default toastSlice.reducer;
