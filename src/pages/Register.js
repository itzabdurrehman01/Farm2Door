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
    <div className="login" style={{ minHeight: '100vh', display: 'flex' }}>
      <aside className="login-left p-5 text-white d-flex flex-column justify-between" style={{ width: '40%', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '120%', height: '120%', opacity: 0.15, background: 'radial-gradient(300px 120px at 20% 30%, rgba(255,255,255,0.2), transparent 70%)' }} />
        <div style={{ zIndex: 1 }}>
          <h1 className="brand mb-4 d-flex align-center gap-sm" style={{ fontSize: '2rem' }}>
            <Icons.Package size={32} /> Farm2Door
          </h1>
          <h2 className="mb-3" style={{ fontSize: '2.5rem', lineHeight: 1.2 }}>Join the Fresh<br />Revolution.</h2>
          <p className="opacity-75" style={{ fontSize: '1.1rem' }}>Connect directly with local farmers and enjoy peak-freshness produce.</p>
        </div>

        <div style={{ zIndex: 1 }}>
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

      <section className="login-right d-flex align-center justify-center bg-secondary" style={{ width: '60%' }}>
        <div className="card p-5" style={{ width: '100%', maxWidth: 520 }}>
          <div className="text-center mb-4">
            <h2 className="mb-2">Create Account</h2>
            <p className="text-muted">Join Farm2Door today</p>
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
              <label className="d-block mb-1 text-sm font-medium">Full Name</label>
              <input
                className="input w-100"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <label className="d-block mb-1 text-sm font-medium">Password</label>
              <input
                className="input w-100"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-error rounded text-sm d-flex align-center gap-sm">
                <Icons.X size={16} /> {error}
              </div>
            )}

            <button className="btn w-100 justify-center py-3" type="submit">
              Create Account
            </button>

            <div className="text-center text-sm mt-3">
              <span className="text-muted">Already have an account?</span>{' '}
              <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>Sign in</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
