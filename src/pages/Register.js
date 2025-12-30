import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault(); setError(null);
    try {
      await auth.register({ name, email, password, role });
      navigate(role === 'admin' ? '/reports' : '/catalog');
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-sidebar">
        <div className="auth-sidebar-bg" />
        <div className="auth-sidebar-content">
          <h1 className="auth-brand">
            <Icons.Package size={32} /> Farm2Door
          </h1>
          <h2 className="auth-title">Join the Fresh<br />Revolution.</h2>
          <p className="auth-subtitle">Connect directly with local farmers and enjoy peak-freshness produce.</p>
        </div>

        <div className="auth-sidebar-content">
          <div className="d-flex flex-column gap-md">
            <div className="d-flex align-center gap-md">
              <div className="p-2 bg-white-10 rounded"><Icons.Check size={20} /></div>
              <div>Support Local Farmers</div>
            </div>
            <div className="d-flex align-center gap-md">
              <div className="p-2 bg-white-10 rounded"><Icons.Check size={20} /></div>
              <div>Traceable Sources</div>
            </div>
            <div className="d-flex align-center gap-md">
              <div className="p-2 bg-white-10 rounded"><Icons.Check size={20} /></div>
              <div>Community Driver</div>
            </div>
          </div>
        </div>
      </aside>

      <section className="auth-main">
        <div className="auth-card">
          <div className="text-center mb-4">
            <h2 className="mb-2">Create Account</h2>
            <p className="text-muted">Join Farm2Door today</p>
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
              <label className="d-block mb-1 text-sm font-medium">Full Name</label>
              <input
                className="input w-full"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <label className="d-block mb-1 text-sm font-medium">Password</label>
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

            <button type="submit" className="btn btn-primary w-full mt-2">
              Create Account
            </button>

            <p className="text-center text-sm text-muted mt-4">
              Already have an account? <Link to="/login" className="text-primary font-medium hover-underline">Sign in</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
