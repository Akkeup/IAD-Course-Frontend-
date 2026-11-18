import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = { isAuthenticated: boolean; username: string | null };
const initialState: AuthState = { isAuthenticated: false, username: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<string>) => { state.isAuthenticated = true; state.username = action.payload; },
    loggedOut: () => initialState,
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;
