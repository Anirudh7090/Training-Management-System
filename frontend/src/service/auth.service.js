import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
};

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};