import { createSlice } from '@reduxjs/toolkit';

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    apps: []
  },
  reducers: {
    refreshAppList: (state, action) => {
      state.apps = action.payload
    }
  }
});

export const { refreshAppList } = homeSlice.actions;

export default homeSlice.reducer;
