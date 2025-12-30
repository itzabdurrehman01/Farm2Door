import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function UsersPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    apiGet('/users')
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => {
        // Fallback for demo
        setItems([
          { id: 1, name: 'Admin User', email: 'admin@farm2door.com', role: 'admin' },
          { id: 2, name: 'John Doe', email: 'john@example.com', role: 'customer' },
          { id: 3, name: 'Jane Smith', email: 'jane@test.com', role: 'customer' }
        ]);
        setLoading(false);
      });
  }, []);

  async function addUser(e) {
    e.preventDefault();
    try {
      if (!name.trim() || !email.trim()) throw new Error('Name and email are required');
      const created = await apiPost('/users', { name, email });
      setItems((prev) => [...prev, created]);
      setName(''); setEmail(''); setShowAdd(false);
    } catch (err) {
      alert(err.message || 'Failed to add user');
    }
  }

  const filtered = items.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Users</h2>
          <p className="text-muted">Manage system users and customers.</p>
        </div>
        <button className="btn" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : <><Icons.Plus size={18} /> Add User</>}
        </button>
      </div>

      {showAdd && (
        <div className="card p-4 mb-4 bg-secondary">
          <h4 className="mb-3">Add New User</h4>
          <form onSubmit={addUser} className="d-flex gap-sm align-end flex-wrap">
            <div className="flex-1" style={{ minWidth: 200 }}>
              <label className="d-block text-sm mb-1">Name</label>
              <input className="input w-100" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex-1" style={{ minWidth: 200 }}>
              <label className="d-block text-sm mb-1">Email</label>
              <input className="input w-100" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button className="btn" type="submit">Create User</button>
          </form>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="p-5 text-center text-muted">Loading users...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No users found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="hover-bg-secondary transition-colors">
                  <td className="py-3 px-4 text-muted">#{u.id}</td>
                  <td className="py-3 px-4">
                    <div className="fw-bold">{u.name}</div>
                    <div className="text-sm text-muted">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {u.role || 'customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="btn sm secondary"><Icons.Menu size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
