import { Link } from 'react-router-dom';
import { useDepartmentDashboard } from './DepartmentDashboard.hook';
import '../AdminDashboard/AdminDashboard.css';
import '../Departments/Departments.css';

function DepartmentDashboard() {
  const h = useDepartmentDashboard();
  const c = h.data?.counts;

  return (
    <div>
      <h1 className="page-title">Departments</h1>
      <p className="page-subtitle">Training stats per department</p>

      <div className="tabs" style={{ marginTop: 16 }}>
        <Link to="/departments" className="tab">Department List</Link>
        <span className="tab active">Department Dashboard</span>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ minWidth: 240 }}>
          <label>Select Department</label>
          <select value={h.selectedId} onChange={(e) => h.setSelectedId(e.target.value)}>
            {h.departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13 }}>
          HOD: <b>{h.selectedDept?.head || '—'}</b>
        </span>
      </div>

      {c && (
        <>
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="card stat-card">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">{c.total_employees}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Training Assignments</div>
              <div className="stat-value">{c.total_assignments}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value">{c.completed_assignments}</div>
            </div>
          </div>

          <div className="card">
            <h3 className="chart-title">Employee training progress</h3>
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Designation</th><th>Assigned</th><th>Completed</th></tr>
              </thead>
              <tbody>
                {h.data.employees.map((e, i) => (
                  <tr key={i}>
                    <td><b>{e.name}</b></td>
                    <td>{e.designation || '—'}</td>
                    <td>{e.trainings_assigned}</td>
                    <td>{e.trainings_completed || 0}</td>
                  </tr>
                ))}
                {h.data.employees.length === 0 && (
                  <tr><td colSpan="4" className="empty">No employees in this department</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default DepartmentDashboard;