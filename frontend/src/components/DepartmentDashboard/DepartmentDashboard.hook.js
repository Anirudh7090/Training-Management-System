import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../redux/slices/departmentsSlice';
import { getDepartmentDashboard } from '../../service/training.service';

export function useDepartmentDashboard() {
  const dispatch = useDispatch();
  const { list: departments } = useSelector((s) => s.departments);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const defaultSelectedId = departments.length > 0 ? String(departments[0].id) : '';
  const currentSelectedId = selectedId || defaultSelectedId;

  useEffect(() => {
    if (!currentSelectedId) return;
    getDepartmentDashboard(currentSelectedId).then((res) => setData(res.data));
  }, [currentSelectedId]);

  const selectedDept = departments.find((d) => String(d.id) === currentSelectedId);

  return { departments, selectedId, setSelectedId, selectedDept, data };
}