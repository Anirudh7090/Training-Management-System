import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

export const fetchDepartments = createAsyncThunk('departments/fetch', async () => {
  const { data } = await api.get('/departments');
  return data;
});

const departmentsSlice = createSlice({
  name: 'departments',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default departmentsSlice.reducer;