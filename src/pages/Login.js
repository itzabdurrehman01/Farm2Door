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
    <div className="login" style={{ minHeight: '100vh', display: 'flex' }}>
      <aside className="login-left p-5 text-white d-flex flex-column justify-between" style={{ width: '40%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '120%', height: '120%', opacity: 0.12, background: 'radial-gradient(300px 120px at 20% 30%, rgba(255,255,255,0.2), transparent 70%)' }} />
        <div style={{ zIndex: 1 }}>
          <h1 className="brand mb-4 d-flex align-center gap-sm" style={{ fontSize: '2rem' }}>
            <Icons.Package size={32} /> Farm2Door
          </h1>
          <h2 className="mb-3" style={{ fontSize: '2.5rem', lineHeight: 1.2 }}>Freshness Delivered<br />To Your Doorstep.</h2>
          <p className="opacity-75" style={{ fontSize: '1.1rem' }}>Join thousands of happy customers enjoying the freshest local produce.</p>
        </div>

        <div className="d-flex gap-lg" style={{ zIndex: 1 }}>
          <div>
            <div className="h2 mb-1">100%</div>
            <div className="opacity-75 text-sm">Organic</div>
          </div>
          <div>
            <div className="h2 mb-1">24h</div>
            <div className="opacity-75 text-sm">Delivery</div>
          </div>
          <div>
            <div className="h2 mb-1">5k+</div>
            <div className="opacity-75 text-sm">Users</div>
          </div>
        </div>
      </aside>

      <section className="login-right d-flex align-center justify-center bg-secondary" style={{ width: '60%' }}>
        <div className="card p-5" style={{ width: '100%', maxWidth: 480 }}>
          <div className="text-center mb-4">
            <h2 className="mb-2">Welcome Back</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <div className="seg p-1 bg-secondary rounded d-flex mb-4">
            <button
              type="button"
              className={`btn flex-1 ${role === 'customer' ? 'shadow-sm' : 'text-muted'}`}
              style={{ background: role === 'customer' ? 'white' : 'transparent' }}
              onClick={() => setRole('customer')}
            >
              Customer
            </button>
            <button
              type="button"
              className={`btn flex-1 ${role === 'admin' ? 'shadow-sm' : 'text-muted'}`}
              style={{ background: role === 'admin' ? 'white' : 'transparent' }}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <form onSubmit={onSubmit} className="d-flex flex-column gap-md">
            <div>
              <label className="d-block mb-1 text-sm font-medium">Email Address</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <input
                  className="input w-100 pl-5"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
                <div style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-secondary)' }}>
                  <Icons.User size={18} />
                </div>
              </div>
            </div>

            <div>
              <div className="d-flex justify-between mb-1">
                <label className="text-sm font-medium">Password</label>
                <Link to="/password-reset" className="text-sm text-primary" style={{ textDecoration: 'none' }}>Forgot?</Link>
              </div>
              <input
                className="input w-100"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-error rounded text-sm d-flex align-center gap-sm">
                <Icons.X size={16} /> {error}
              </div>
            )}

            <button className="btn w-100 justify-center py-3" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center text-sm mt-3">
              <span className="text-muted">Don't have an account?</span>{' '}
              <Link to="/register" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>Create account</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
