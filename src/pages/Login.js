import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      await auth.login({ email: email.trim().toLowerCase(), password: password.trim(), role });
      navigate(role === 'admin' ? '/reports' : '/catalog');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-sidebar">
        <div className="auth-sidebar-bg" />
        <div className="auth-sidebar-content">
          <h1 className="auth-brand">
            <Icons.Package size={32} /> Farm2Door
          </h1>
          <h2 className="auth-title">Freshness Delivered<br />To Your Doorstep.</h2>
          <p className="auth-subtitle">Join thousands of happy customers enjoying the freshest local produce.</p>
        </div>

        <div className="auth-stats">
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Organic</div>
          </div>
          <div>
            <div className="stat-value">24h</div>
            <div className="stat-label">Delivery</div>
          </div>
          <div>
            <div className="stat-value">5k+</div>
            <div className="stat-label">Users</div>
          </div>
        </div>
      </aside>

      <section className="auth-main">
        <div className="auth-card">
          <div className="text-center mb-4">
            <h2 className="mb-2">Welcome Back</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === 'customer' ? 'active' : ''}`}
              onClick={() => setRole('customer')}
            >
              Customer
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          {error && <div className="bg-error-light text-error p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={onSubmit} className="d-flex flex-column gap-md">
            <div>
              <label className="d-block mb-1 text-sm font-medium">Email Address</label>
              <div className="input-icon-wrap">
                <Icons.User size={18} className="input-icon" />
                <input
                  className="input w-full input-with-icon"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="d-flex justify-between mb-1">
                <label className="text-sm font-medium">Password</label>
                <Link to="/password-reset" className="text-sm text-primary hover-underline">Forgot?</Link>
              </div>
              <div className="input-icon-wrap">
                <Icons.Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="input w-full input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-muted mt-4">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover-underline">Create one</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
