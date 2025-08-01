import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null
};

const empresaSlice = createSlice({
  name: 'empresa',
  initialState,
  reducers: {
    setEmpresaId(state, action) {
      state.id = action.payload;
      if (state.id !== null && state.id !== undefined) {
        localStorage.setItem('empresaActivaId', state.id);
      } else {
        localStorage.removeItem('empresaActivaId');
      }
    },
    initEmpresaId(state) {
      const stored = localStorage.getItem('empresaActivaId');
      if (stored) {
        state.id = Number(stored);
      }
    }
  }
});

export const { setEmpresaId, initEmpresaId } = empresaSlice.actions;
export default empresaSlice.reducer;
