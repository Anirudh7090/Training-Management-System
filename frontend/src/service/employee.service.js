import api from './api';

export const createEmployee = (payload) => api.post('/employees', payload);
export const updateEmployee = (id, payload) => api.put(`/employees/${id}`, payload);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);