import { Link } from 'react-router-dom';
import { useLogin } from './Login.hook';
import './Login.css';

function Login() {
  const { form, error, loading, handleChange, handleSubmit } = useLogin();

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">PolymerX</div>
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-sub">Training & Training Need Management</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>

        <button className="btn btn-primary auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;