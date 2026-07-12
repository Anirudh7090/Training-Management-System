import { useEmployees } from './Employees.hook';
import './Employees.css';

const statusBadge = (status) =>
  status === 'Active' ? 'badge badge-success'
  : status === 'On Leave' ? 'badge badge-warn'
  : 'badge badge-gray';

const initials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function Employees() {
  const h = useEmployees();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{h.allCount} employees</p>
        </div>
        <button className="btn btn-accent" onClick={h.openAdd}>+ Add employee</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search by name or ID..."
            value={h.search}
            onChange={(e) => h.setSearch(e.target.value)}
          />
          <select value={h.deptFilter} onChange={(e) => h.setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {h.departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select value={h.statusFilter} onChange={(e) => h.setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
          <span className="showing">Showing {h.employees.length} of {h.allCount}</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Employee ID</th><th>Name</th><th>Department</th><th>Designation</th>
              <th>Manager</th><th>Status</th><th>Joined</th><th>Rating</th><th></th>
            </tr>
          </thead>
          <tbody>
            {h.employees.map((e) => (
              <tr key={e.id}>
                <td className="mono">PX-{1000 + e.id}</td>
                <td>
                  <div className="emp-cell">
                    <span className="avatar">{initials(e.name)}</span>
                    <div>
                      <div className="emp-name">{e.name}</div>
                      <div className="emp-email">{e.email}</div>
                    </div>
                  </div>
                </td>
                <td>{e.department_name || '—'}</td>
                <td>{e.designation || '—'}</td>
                <td>{e.manager || '—'}</td>
                <td><span className={statusBadge(e.status)}>{e.status}</span></td>
                <td>{e.join_date ? e.join_date.slice(0, 10) : '—'}</td>
                <td><b>{e.rating}</b>/5</td>
                <td>
                  <button className="btn-icon" onClick={() => h.openEdit(e)}>✏️</button>
                  <button className="btn-icon" onClick={() => h.handleDelete(e.id)}>🗑️</button>
                </td>
              </tr>
            ))}
            {!h.loading && h.employees.length === 0 && (
              <tr><td colSpan="9" className="empty">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {h.modalOpen && (
        <div className="modal-overlay" onClick={() => h.setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{h.editingId ? 'Edit employee' : 'Add employee'}</h3>
              <button className="btn-icon" onClick={() => h.setModalOpen(false)}>✕</button>
            </div>

            {h.error && <div className="auth-error">{h.error}</div>}

            <div className="form-field">
              <label>Full name *</label>
              <input name="name" value={h.form.name} onChange={h.handleChange} />
            </div>
            <div className="form-row">
              <div>
                <label>Email *</label>
                <input name="email" type="email" value={h.form.email} onChange={h.handleChange} />
              </div>
              <div>
                <label>Designation</label>
                <input name="designation" value={h.form.designation} onChange={h.handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Manager</label>
                <input name="manager" value={h.form.manager} onChange={h.handleChange} />
              </div>
              <div>
                <label>Department</label>
                <select name="department_id" value={h.form.department_id} onChange={h.handleChange}>
                  <option value="">Select department</option>
                  {h.departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Status</label>
                <select name="status" value={h.form.status} onChange={h.handleChange}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label>Joining Date</label>
                <input name="join_date" type="date" value={h.form.join_date} onChange={h.handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Contact Number</label>
                <input name="contact" value={h.form.contact} onChange={h.handleChange} placeholder="+91 98xxxxxx00" />
              </div>
              <div>
                <label>Date of Birth</label>
                <input name="dob" type="date" value={h.form.dob} onChange={h.handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Rating (0–5)</label>
                <input name="rating" type="number" min="0" max="5" step="0.1"
                       value={h.form.rating} onChange={h.handleChange} />
              </div>
              <div />
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

export default Employees;