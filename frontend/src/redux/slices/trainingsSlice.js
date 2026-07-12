import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

export const fetchTrainings = createAsyncThunk('trainings/fetch', async () => {
  const { data } = await api.get('/trainings');
  return data;
});

const trainingsSlice = createSlice({
  name: 'trainings',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainings.pending, (state) => { state.loading = true; })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default trainingsSlice.reducer;