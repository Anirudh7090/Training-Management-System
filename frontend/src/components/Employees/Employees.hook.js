import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeesSlice';
import { fetchDepartments } from '../../redux/slices/departmentsSlice';
import { createEmployee, updateEmployee, deleteEmployee } from '../../service/employee.service';

const EMPTY_FORM = {
  name: '', email: '', designation: '', manager: '', department_id: '',
  status: 'Active', join_date: '', contact: '', dob: '', rating: '',
};

export function useEmployees() {
  const dispatch = useDispatch();
  const { list: employees, loading } = useSelector((s) => s.employees);
  const { list: departments } = useSelector((s) => s.departments);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Add mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // derived state — recomputed on render, never stored
  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        String(e.id).includes(search);
      const matchDept = !deptFilter || String(e.department_id) === deptFilter;
      const matchStatus = !statusFilter || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      name: emp.name || '', email: emp.email || '', designation: emp.designation || '',
      manager: emp.manager || '', department_id: emp.department_id || '',
      status: emp.status || 'Active',
      join_date: emp.join_date ? emp.join_date.slice(0, 10) : '',
      contact: emp.contact || '',
      dob: emp.dob ? emp.dob.slice(0, 10) : '',
      rating: emp.rating || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    try {
      const payload = { ...form, department_id: form.department_id || null };
      if (editingId) await updateEmployee(editingId, payload);
      else await createEmployee(payload);
      setModalOpen(false);
      dispatch(fetchEmployees());
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await deleteEmployee(id);
    dispatch(fetchEmployees());
  };

  return {
    employees: filtered, allCount: employees.length, departments, loading,
    search, setSearch, deptFilter, setDeptFilter, statusFilter, setStatusFilter,
    modalOpen, setModalOpen, editingId, form, error,
    openAdd, openEdit, handleChange, handleSave, handleDelete,
  };
}