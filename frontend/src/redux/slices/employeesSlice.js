import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

export const fetchEmployees = createAsyncThunk('employees/fetch', async () => {
  const { data } = await api.get('/employees');
  return data;
});

const employeesSlice = createSlice({
  name: 'employees',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default employeesSlice.reducer;