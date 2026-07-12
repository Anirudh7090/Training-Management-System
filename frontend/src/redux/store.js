import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import departmentsReducer from './slices/departmentsSlice';
import trainingsReducer from './slices/trainingsSlice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
    trainings: trainingsReducer,
  },
});