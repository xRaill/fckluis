import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialState {
  initialized: boolean;
  loggedIn: boolean;
  accessToken: string;
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState: <initialState>{
    initialized: false,
    loggedIn: undefined,
    accessToken: '',
  },
  reducers: {
    update: (state, action: PayloadAction<Partial<initialState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { update } = sessionSlice.actions;
export default sessionSlice.reducer;
