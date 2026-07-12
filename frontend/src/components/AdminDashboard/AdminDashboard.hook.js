import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../service/training.service';

export function useAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}