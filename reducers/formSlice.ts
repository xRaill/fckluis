import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type data = { field: string; value: unknown };
type error = { field: string; message: string };

interface initialState {
  active: boolean;
  focus: number;
  data: data[];
  errors: error[];
}

export const formSlice = createSlice({
  name: 'toasts',
  initialState: {
    active: false,
    data: [],
    errors: [],
  } as initialState,
  reducers: {
    updateData: (state, action: PayloadAction<data>) => {
      const { field, value } = action.payload;
      const index = state.data.findIndex((a) => a.field === field);
      if (index !== -1) {
        state.data[index].value = value;
      } else {
        state.data.push({ field, value });
      }
    },
    addError: (state, action: PayloadAction<error>) => {
      const { field, message } = action.payload;
      const index = state.errors.findIndex((a) => a.field === field);
      if (index !== -1) {
        state.errors[index].message = message;
      } else {
        state.errors.push({ field, message });
      }
    },
    start: (state) => {
      state.errors = [];
      state.active = true;
    },
    stop: (state) => {
      state.active = false;
    },
    reset: (state) => {
      state.active = false;
      state.data = [];
      state.errors = [];
    },
  },
});

export const { updateData, addError, start, stop, reset } = formSlice.actions;

export default formSlice.reducer;
