import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const [agree, setAgree] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault(); setError(null);
    if (!agree) { setError('Please accept Terms and Privacy'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    try {
      await auth.register({ name, email, password, role });
      navigate(role === 'admin' ? '/reports' : '/catalog');
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="auth-layout auth-theme">
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
              <span className="d-flex align-center gap-sm"><Icons.User size={16} /> Customer</span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <span className="d-flex align-center gap-sm"><Icons.Lock size={16} /> Admin</span>
            </button>
          </div>

          {error && <div className="bg-error-light text-error p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={onSubmit} className="d-flex flex-column gap-md">
            <div>
              <label className="d-block mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
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
                  type="email"
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
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Icons.Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input w-full input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-ghost text-muted"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 8, top: 6 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="progress bg-secondary" style={{ height: 6, borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
                <div
                  style={{
                    width: `${Math.min(100, password.length * 10)}%`,
                    height: '100%',
                    background: password.length >= 8 ? 'var(--success)' : 'var(--primary)'
                  }}
                />
              </div>
            </div>

            <div>
              <label className="d-block mb-1 text-sm font-medium">Confirm Password</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Icons.Lock size={18} className="input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="input w-full input-with-icon"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-ghost text-muted"
                  onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 8, top: 6 }}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="d-flex align-center gap-sm">
              <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <label htmlFor="agree" className="text-sm">
                I agree to the <Link to="/terms" className="text-primary">Terms</Link> and <Link to="/privacy" className="text-primary">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2">
              Create Account
            </button>
            <div className="auth-social">
              <button type="button" className="social-btn"><Icons.User size={16} /> Sign up with Google</button>
              <button type="button" className="social-btn"><Icons.User size={16} /> Sign up with Apple</button>
            </div>

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
