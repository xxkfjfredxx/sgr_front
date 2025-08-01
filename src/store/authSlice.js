import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('user');

const initialState = {
  token: localStorage.getItem('token') || null,
  user: storedUser ? JSON.parse(storedUser) : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    logOut(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('empresaActivaId');
    }
  }
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
