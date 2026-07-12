import { Link } from 'react-router-dom';
import { useDepartments } from './Departments.hook';
import './Departments.css';

const toLakh = (n) => `₹${(Number(n || 0) / 100000).toFixed(1)}L`;

function Departments() {
  const h = useDepartments();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Master data, budgets and HODs.</p>
        </div>
        <button className="btn btn-primary" onClick={h.openAdd}>+ Add Department</button>
      </div>

      <div className="tabs">
        <span className="tab active">Department List</span>
        <Link to="/departments/dashboard" className="tab">Department Dashboard</Link>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>HOD</th><th>Employees</th><th>Budget</th><th></th>
            </tr>
          </thead>
          <tbody>
            {h.departments.map((d, i) => (
              <tr key={d.id}>
                <td className="mono">DPT-{String(i + 1).padStart(2, '0')}</td>
                <td><b>{d.name}</b></td>
                <td>{d.head || '—'}</td>
                <td>{d.employee_count}</td>
                <td className="budget">{toLakh(d.budget)}</td>
                <td>
                  <button className="btn-icon" onClick={() => h.openEdit(d)}>✏️</button>
                  <button className="btn-icon" onClick={() => h.handleDelete(d.id)}>🗑️</button>
                </td>
              </tr>
            ))}
            {!h.loading && h.departments.length === 0 && (
              <tr><td colSpan="6" className="empty">No departments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {h.modalOpen && (
        <div className="modal-overlay" onClick={() => h.setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{h.editingId ? 'Edit Department' : 'Add Department'}</h3>
              <button className="btn-icon" onClick={() => h.setModalOpen(false)}>✕</button>
            </div>

            {h.error && <div className="auth-error">{h.error}</div>}

            <div className="form-field">
              <label>Department Name</label>
              <input name="name" value={h.form.name} onChange={h.handleChange} />
            </div>
            <div className="form-row">
              <div>
                <label>HOD</label>
                <select name="head" value={h.form.head} onChange={h.handleChange}>
                  <option value="">Select HOD</option>
                  {h.hodOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Budget (₹)</label>
                <input name="budget" type="number" min="0" value={h.form.budget} onChange={h.handleChange} />
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" rows="3" value={h.form.description} onChange={h.handleChange} />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => h.setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={h.handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;