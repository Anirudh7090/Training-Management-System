export const API_URL = import.meta.env.VITE_API_URL;

export const TRAINING_STATUSES = ['Draft', 'Active', 'Completed'];
export const TRAINING_CATEGORIES = ['Safety', 'Quality', 'Production', 'Process', 'General'];
export const ASSIGNMENT_STATUSES = ['Assigned', 'In Progress', 'Completed'];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Admin Dashboard', icon: '▦' },
  { path: '/employees', label: 'Employees', icon: '👥' },
  { path: '/departments', label: 'Departments', icon: '🏢' },
  { path: '/trainings', label: 'Training Management', icon: '🎓' },
  { path: '/mapping', label: 'TNI & Mapping', icon: '◎' },
];