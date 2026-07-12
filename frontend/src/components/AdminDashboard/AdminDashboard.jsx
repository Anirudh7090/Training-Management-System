import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAdminDashboard } from './AdminDashboard.hook';
import './AdminDashboard.css';

const DONUT_COLORS = { Assigned: '#1e40af', 'In Progress': '#f97316', Completed: '#15803d' };

function AdminDashboard() {
  const { data, loading } = useAdminDashboard();

  if (loading) return <p>Loading dashboard...</p>;
  const c = data.counts;

  const stats = [
    { label: 'Total Employees', value: c.total_employees },
    { label: 'Departments', value: c.total_departments },
    { label: 'Trainings', value: c.total_trainings, sub: `${c.ongoing_trainings} active` },
    { label: 'Assignments', value: c.total_assignments, sub: `${c.completed_assignments} completed` },
  ];

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Training overview across the company</p>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3 className="chart-title">Training assignments by department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.byDepartment} margin={{ bottom: 20 }}>
              <XAxis dataKey="department" fontSize={11} interval={0}
                angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} fontSize={12} />
               <Tooltip />
              <Bar dataKey="assignments" fill="#1e40af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="chart-title">Assignment status distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.statusDist} dataKey="count" nameKey="status"
                   innerRadius={60} outerRadius={95}>
                {data.statusDist.map((s) => (
                  <Cell key={s.status} fill={DONUT_COLORS[s.status] || '#6b7280'} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;