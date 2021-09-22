import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialState {
  initialized: boolean;
  loggedIn: boolean;
  accessToken: string;
  admin: boolean;
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState: <initialState>{
    initialized: false,
    loggedIn: undefined,
    accessToken: '',
    admin: undefined,
  },
  reducers: {
    update: (state, action: PayloadAction<Partial<initialState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { update } = sessionSlice.actions;
export default sessionSlice.reducer;
