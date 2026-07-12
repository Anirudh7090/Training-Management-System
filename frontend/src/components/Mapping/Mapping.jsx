import { useMapping } from './Mapping.hook';
import './Mapping.css';

function Mapping() {
  const h = useMapping();
  const years = [h.currentYear - 1, h.currentYear, h.currentYear + 1];

  return (
    <div>
      <h1 className="page-title">TNI & Competency Mapping</h1>
      <p className="page-subtitle">Competency matrix and training-need identification.</p>

      <div className="card filter-bar">
        <div>
          <label>Department</label>
          <select value={h.deptId} onChange={(e) => { h.setDeptId(e.target.value); h.setEmpId(''); }}>
            <option value="">All</option>
            {h.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Employee</label>
          <select value={h.empId} onChange={(e) => h.setEmpId(e.target.value)}>
            <option value="">Select employee</option>
            {h.deptEmployees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label>Year</label>
          <select value={h.year} onChange={(e) => h.setYear(Number(e.target.value))}>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {h.selectedEmployee && (
        <>
          <div className="card emp-strip">
            <div><span className="stat-label">Employee</span><b>{h.selectedEmployee.name}</b></div>
            <div><span className="stat-label">Designation</span><b>{h.selectedEmployee.designation || '—'}</b></div>
            <div><span className="stat-label">Department</span><b>{h.selectedEmployee.department_name || '—'}</b></div>
            <div><span className="stat-label">Rating</span><b>{h.selectedEmployee.rating}/5</b></div>
          </div>

          <div className="card matrix-card">
            <div className="matrix-header">Technical / Functional Skill Development</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Training Topic</th><th>Required (1-5)</th><th>Self (1-5)</th>
                  <th>HOD (1-5)</th><th>Gap</th><th>Training?</th><th></th>
                </tr>
              </thead>
              <tbody>
                {h.rows.map((row, i) => {
                  const g = h.gapInfo(row);
                  return (
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>
                        <input value={row.topic}
                               onChange={(e) => h.editRow(row.id, 'topic', e.target.value)}
                               onBlur={() => h.saveRow(row)} />
                      </td>
                      {['required_level', 'self_level', 'hod_level'].map((f) => (
                        <td key={f}>
                          <input type="number" min="0" max="5" className="level-input"
                                 value={row[f]}
                                 onChange={(e) => h.editRow(row.id, f, e.target.value)}
                                 onBlur={() => h.saveRow(row)} />
                        </td>
                      ))}
                      <td><span className={g.cls}>{g.label}</span></td>
                      <td>
                        <span className={g.training === 'Yes' ? 'badge badge-danger' : 'badge badge-success'}>
                          {g.training}
                        </span>
                      </td>
                      <td><button className="btn-icon" onClick={() => h.handleDelete(row.id)}>🗑️</button></td>
                    </tr>
                  );
                })}
                {h.rows.length === 0 && (
                  <tr><td colSpan="8" className="empty">No topics yet — add one below</td></tr>
                )}
              </tbody>
            </table>

            <div className="assign-row" style={{ marginTop: 14 }}>
              <input placeholder="New training topic..." value={h.newTopic}
                     onChange={(e) => h.setNewTopic(e.target.value)} />
              <button className="btn btn-primary" onClick={h.handleAdd}>+ Add Topic</button>
            </div>
          </div>
        </>
      )}

      {!h.selectedEmployee && (
        <div className="card empty">Select an employee to view their competency matrix.</div>
      )}
    </div>
  );
}

export default Mapping;