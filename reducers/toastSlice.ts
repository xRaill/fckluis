import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Toast = {
  type: 'success' | 'danger';
  message: string;
  state: 'entering' | 'entered' | 'exiting';
};

export type initialState = { toasts: Toast[] };

export const toastSlice = createSlice({
  name: 'toasts',
  initialState: {
    toasts: [],
  } as initialState,
  reducers: {
    add: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload);
    },
    entered: (state) => {
      const index = state.toasts.findIndex((a) => a.state == 'entering');
      if (typeof index == 'number') state.toasts[index].state = 'entered';
    },
    exiting: (state) => {
      const index = state.toasts.findIndex((a) => a.state == 'entered');
      if (typeof index == 'number') state.toasts[index].state = 'exiting';
    },
    pop: (state) => {
      state.toasts.shift();
    },
  },
});

export const { add, entered, exiting, pop } = toastSlice.actions;

export default toastSlice.reducer;
