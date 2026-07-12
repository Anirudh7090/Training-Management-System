import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeesSlice';
import { fetchDepartments } from '../../redux/slices/departmentsSlice';
import { getNeeds, addNeed, updateNeed, deleteNeed } from '../../service/training.service';

export function useMapping() {
  const dispatch = useDispatch();
  const { list: employees } = useSelector((s) => s.employees);
  const { list: departments } = useSelector((s) => s.departments);

  const currentYear = new Date().getFullYear();
  const [deptId, setDeptId] = useState('');
  const [empId, setEmpId] = useState('');
  const [year, setYear] = useState(currentYear);
  const [rows, setRows] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // employees limited to the chosen department
  const deptEmployees = useMemo(
    () => employees.filter((e) => !deptId || String(e.department_id) === deptId),
    [employees, deptId]
  );

  const selectedEmployee = employees.find((e) => String(e.id) === empId);

  const load = useCallback(async () => {
    await Promise.resolve();
    if (!empId) { setRows([]); return; }
    const { data } = await getNeeds(empId, year);
    setRows(data);
  }, [empId, year]);

  useEffect(() => {
    // call load asynchronously to avoid synchronous setState inside effect
    (async () => { await load(); })();
  }, [load]);

  // gap is computed, never stored
  const gapInfo = (row) => {
    const gap = row.required_level - row.hod_level;
    if (gap <= 0) return { gap: 0, label: '0 · No Gap', cls: 'badge badge-success', training: 'No' };
    if (gap === 1) return { gap, label: '1 · Monitor', cls: 'badge badge-warn', training: 'No' };
    return { gap, label: `${gap} · Training Required`, cls: 'badge badge-danger', training: 'Yes' };
  };

  // edit locally as you type…
  const LEVEL_FIELDS = ['required_level', 'self_level', 'hod_level'];
  const clamp = (v) => Math.max(0, Math.min(5, Number(v) || 0));

  const editRow = (id, field, value) =>
    setRows(rows.map((r) =>
     r.id === id
      ? { ...r, [field]: LEVEL_FIELDS.includes(field) ? clamp(value) : value }
      : r
   ));

  // …save to the API when the input loses focus
  const saveRow = async (row) => {
    await updateNeed(row.id, {
      topic: row.topic,
      required_level: Number(row.required_level) || 0,
      self_level: Number(row.self_level) || 0,
      hod_level: Number(row.hod_level) || 0,
    });
  };

  const handleAdd = async () => {
    if (!newTopic || !empId) return;
    await addNeed({ employee_id: Number(empId), topic: newTopic, year });
    setNewTopic('');
    load();
  };

  const handleDelete = async (id) => {
    await deleteNeed(id);
    load();
  };

  return {
    departments, deptEmployees, selectedEmployee,
    deptId, setDeptId, empId, setEmpId, year, setYear, currentYear,
    rows, gapInfo, editRow, saveRow,
    newTopic, setNewTopic, handleAdd, handleDelete,
  };
}