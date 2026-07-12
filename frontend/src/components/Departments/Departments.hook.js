import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../redux/slices/departmentsSlice';
import { fetchEmployees } from '../../redux/slices/employeesSlice';
import { createDepartment, updateDepartment, deleteDepartment } from '../../service/department.service';

const EMPTY_FORM = { name: '', head: '', budget: '', description: '' };

export function useDepartments() {
  const dispatch = useDispatch();
  const { list: departments, loading } = useSelector((s) => s.departments);
  const { list: employees } = useSelector((s) => s.employees);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const hodOptions = employees.map((e) => e.name);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditingId(dept.id);
    setForm({
      name: dept.name || '', head: dept.head || '',
      budget: dept.budget || '', description: dept.description || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name) {
      setError('Department name is required');
      return;
    }
    try {
      if (editingId) await updateDepartment(editingId, form);
      else await createDepartment(form);
      setModalOpen(false);
      dispatch(fetchDepartments());
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await deleteDepartment(id);
      dispatch(fetchDepartments());
    } catch {
      alert('Cannot delete: employees are still assigned to this department.');
    }
  };

  return {
    departments, loading, hodOptions,
    modalOpen, setModalOpen, editingId, form, error,
    openAdd, openEdit, handleChange, handleSave, handleDelete,
  };
}