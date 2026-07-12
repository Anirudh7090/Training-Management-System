import { useTrainings } from './Trainings.hook';
import { TRAINING_CATEGORIES, TRAINING_STATUSES } from '../../constants';
import './Trainings.css';

function Stars({ value, onChange }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}
              className={n <= value ? 'star filled' : 'star'}
              onClick={() => onChange(n)}>★</span>
      ))}
    </span>
  );
}

function Trainings() {
  const h = useTrainings();

  const completion = (t) => Number(t.avg_progress || 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Training Management</h1>
          <p className="page-subtitle">Courses, assignments and progress tracking.</p>
        </div>
        <button className="btn btn-primary" onClick={h.openAdd}>+ New course</button>
      </div>

      <input
        className="search-input course-search"
        placeholder="Search courses..."
        value={h.search}
        onChange={(e) => h.setSearch(e.target.value)}
      />

      <div className="course-grid">
        {h.trainings.map((t) => (
          <div className="card course-card" key={t.id}>
            <div className="course-top">
              <span className="badge badge-gray">{t.category}</span>
              <span className={t.status === 'Active' ? 'badge badge-success'
                : t.status === 'Draft' ? 'badge badge-warn' : 'badge badge-gray'}>
                {t.status}
              </span>
            </div>
            <h3 className="course-title">{t.title}</h3>
            <p className="course-desc">{t.description || '—'}</p>
            <div className="course-meta">
              <span>{t.duration_hours || 0}h · TR-{100 + t.id}</span>
              <span>{t.assigned_count} assigned</span>
            </div>
            <div className="course-progress">
              <div className="progress-labels">
                <span>Completion</span><span>{completion(t)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${completion(t)}%` }} />
              </div>
            </div>
            <div className="course-actions">
              <button className="btn btn-outline" onClick={() => h.openManage(t)}>Manage</button>
              <button className="btn-icon" onClick={() => h.openEdit(t)}>✏️</button>
              <button className="btn-icon" onClick={() => h.handleDelete(t.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {!h.loading && h.trainings.length === 0 && <p>No courses yet — create one.</p>}
      </div>

      {/* ---------- New / Edit course modal ---------- */}
      {h.courseModal && (
        <div className="modal-overlay" onClick={() => h.setCourseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{h.editingId ? 'Edit course' : 'New course'}</h3>
              <button className="btn-icon" onClick={() => h.setCourseModal(false)}>✕</button>
            </div>

            {h.error && <div className="auth-error">{h.error}</div>}

            <div className="form-field">
              <label>Title</label>
              <input name="title" value={h.form.title} onChange={h.handleChange} />
            </div>
            <div className="form-row-3">
              <div>
                <label>Category</label>
                <select name="category" value={h.form.category} onChange={h.handleChange}>
                  {TRAINING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Duration (hours)</label>
                <input name="duration_hours" type="number" min="0"
                       value={h.form.duration_hours} onChange={h.handleChange} />
              </div>
              <div>
                <label>Status</label>
                <select name="status" value={h.form.status} onChange={h.handleChange}>
                  {TRAINING_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" rows="3" value={h.form.description} onChange={h.handleChange} />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => h.setCourseModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={h.handleSave}>
                {h.editingId ? 'Save changes' : 'Create course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Manage (mapping) modal ---------- */}
      {h.manageTraining && (
        <div className="modal-overlay" onClick={h.closeManage}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{h.manageTraining.title}</h3>
                <p className="page-subtitle">Assign employees, track progress, record proficiency.</p>
              </div>
              <button className="btn-icon" onClick={h.closeManage}>✕</button>
            </div>

            <div className="assign-row">
              <select value={h.selectedEmp} onChange={(e) => h.setSelectedEmp(e.target.value)}>
                <option value="">Select employee...</option>
                {h.availableEmployees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={h.handleAssign}>Assign</button>
            </div>

            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Progress</th><th>Proficiency</th><th></th></tr>
              </thead>
              <tbody>
                {h.assignments.map((a) => (
                  <tr key={a.id}>
                    <td><b>{a.employee_name}</b></td>
                    <td>
                      <div className="progress-cell">
                        <input type="range" min="0" max="100" step="10"
                               value={a.progress}
                               onChange={(e) => h.handleProgress(a, Number(e.target.value))} />
                        <span>{a.progress}%</span>
                      </div>
                    </td>
                    <td><Stars value={a.proficiency} onChange={(n) => h.handleStars(a, n)} /></td>
                    <td><button className="btn-icon" onClick={() => h.handleRemove(a.id)}>🗑️</button></td>
                  </tr>
                ))}
                {h.assignments.length === 0 && (
                  <tr><td colSpan="4" className="empty">No one assigned yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trainings;