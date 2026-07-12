import { Link } from 'react-router-dom';
import { useRegister } from './Register.hook';
import '../Login/Login.css';

function Register() {
  const { form, error, loading, handleChange, handleSubmit } = useRegister();

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">PolymerX</div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Admin registration</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-field">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>

        <button className="btn btn-primary auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;