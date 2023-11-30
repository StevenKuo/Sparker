import { configureStore } from '@reduxjs/toolkit';
import homeSlice from './pages/home/duck';

export default configureStore({
  reducer: {
    home: homeSlice
  },
});
