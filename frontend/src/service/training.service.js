import api from './api';

// trainings
export const createTraining = (payload) => api.post('/trainings', payload);
export const updateTraining = (id, payload) => api.put(`/trainings/${id}`, payload);
export const deleteTraining = (id) => api.delete(`/trainings/${id}`);

// assignments (mapping employees to trainings)
export const getAssignments = (trainingId) => api.get(`/assignments/training/${trainingId}`);
export const assignEmployees = (training_id, employee_ids) =>
  api.post('/assignments', { training_id, employee_ids });
export const updateAssignment = (id, payload) => api.put(`/assignments/${id}`, payload);
export const removeAssignment = (id) => api.delete(`/assignments/${id}`);

// TNI needs matrix
export const getNeeds = (employeeId, year) =>
  api.get(`/needs/employee/${employeeId}`, { params: { year } });
export const addNeed = (payload) => api.post('/needs', payload);
export const updateNeed = (id, payload) => api.put(`/needs/${id}`, payload);
export const deleteNeed = (id) => api.delete(`/needs/${id}`);

// dashboards
export const getAdminDashboard = () => api.get('/dashboard/admin');
export const getDepartmentDashboard = (id) => api.get(`/dashboard/department/${id}`);