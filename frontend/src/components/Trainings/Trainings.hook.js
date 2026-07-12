import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrainings } from '../../redux/slices/trainingsSlice';
import { fetchEmployees } from '../../redux/slices/employeesSlice';
import {
  createTraining, updateTraining, deleteTraining,
  getAssignments, assignEmployees, updateAssignment, removeAssignment,
} from '../../service/training.service';

const EMPTY_FORM = {
  title: '', category: 'Safety', duration_hours: '', status: 'Active', description: '',
};

export function useTrainings() {
  const dispatch = useDispatch();
  const { list: trainings, loading } = useSelector((s) => s.trainings);
  const { list: employees } = useSelector((s) => s.employees);

  const [search, setSearch] = useState('');

  // course modal
  const [courseModal, setCourseModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  // manage modal
  const [manageTraining, setManageTraining] = useState(null); // the training being managed
  const [assignments, setAssignments] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');

  useEffect(() => {
    dispatch(fetchTrainings());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filtered = useMemo(
    () => trainings.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())),
    [trainings, search]
  );

  /* ---------- course create/edit ---------- */
  const openAdd = () => {
    setEditingId(null); setForm(EMPTY_FORM); setError(''); setCourseModal(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title || '', category: t.category || 'Safety',
      duration_hours: t.duration_hours || '', status: t.status || 'Active',
      description: t.description || '',
    });
    setError(''); setCourseModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.title) { setError('Title is required'); return; }
    try {
      if (editingId) await updateTraining(editingId, form);
      else await createTraining(form);
      setCourseModal(false);
      dispatch(fetchTrainings());
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course and its assignments?')) return;
    await deleteTraining(id);
    dispatch(fetchTrainings());
  };

  /* ---------- manage (mapping) modal ---------- */
  const loadAssignments = async (trainingId) => {
    const { data } = await getAssignments(trainingId);
    setAssignments(data);
  };

  const openManage = async (t) => {
    setManageTraining(t);
    setSelectedEmp('');
    await loadAssignments(t.id);
  };

  const closeManage = () => {
    setManageTraining(null);
    dispatch(fetchTrainings()); // refresh assigned counts on the cards
  };

  const handleAssign = async () => {
    if (!selectedEmp) return;
    await assignEmployees(manageTraining.id, [Number(selectedEmp)]);
    setSelectedEmp('');
    await loadAssignments(manageTraining.id);
  };

  const handleProgress = async (a, progress) => {
    const status = progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Assigned';
    await updateAssignment(a.id, { status, progress, proficiency: a.proficiency });
    await loadAssignments(manageTraining.id);
  };

  const handleStars = async (a, proficiency) => {
    await updateAssignment(a.id, { status: a.status, progress: a.progress, proficiency });
    await loadAssignments(manageTraining.id);
  };

  const handleRemove = async (id) => {
  if (!window.confirm('Remove this employee from the training?')) return;
  await removeAssignment(id);
  await loadAssignments(manageTraining.id);
  };

  // employees not yet assigned to this training (for the dropdown)
  const availableEmployees = useMemo(() => {
    const assignedIds = new Set(assignments.map((a) => a.employee_id));
    return employees.filter((e) => !assignedIds.has(e.id));
  }, [employees, assignments]);

  return {
    trainings: filtered, loading, search, setSearch,
    courseModal, setCourseModal, editingId, form, error,
    openAdd, openEdit, handleChange, handleSave, handleDelete,
    manageTraining, assignments, availableEmployees, selectedEmp, setSelectedEmp,
    openManage, closeManage, handleAssign, handleProgress, handleStars, handleRemove,
  };
}