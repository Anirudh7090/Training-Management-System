import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Employees from '../components/Employees/Employees';
import Departments from '../components/Departments/Departments';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
import DepartmentDashboard from '../components/DepartmentDashboard/DepartmentDashboard';
import Trainings from '../components/Trainings/Trainings';
import Mapping from '../components/Mapping/Mapping';

function ProtectedRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/dashboard" element={<DepartmentDashboard />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/mapping" element={<Mapping />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;