import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function SuppliersPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    apiGet('/suppliers')
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => { setError('Failed to load suppliers'); setLoading(false); });
  }, []);
  async function add(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Name is required');
    try {
      setSubmitting(true);
      const created = await apiPost('/suppliers', { name, contact });
      setItems((prev) => [...prev, created]);
      setName(''); setContact('');
    } catch (_) {
      alert('Failed to add supplier');
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = items.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    String(s.contact || '').toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Suppliers</h2>
          <p className="text-muted">Manage producers and contact details.</p>
        </div>
        <button className="btn"><Icons.Users size={18} /> Invite Supplier</button>
      </div>
      <div className="card p-4 mb-4 bg-secondary">
        <h4 className="mb-3">Add New Supplier</h4>
        <form onSubmit={add} className="d-flex gap-sm align-end flex-wrap">
          <div className="flex-1" style={{ minWidth: 220 }}>
            <label className="d-block text-sm mb-1">Name</label>
            <input className="input w-100" placeholder="Green Valley Farms" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex-1" style={{ minWidth: 220 }}>
            <label className="d-block text-sm mb-1">Contact</label>
            <input className="input w-100" placeholder="contact@farm.com" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Supplier'}</button>
        </form>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search suppliers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-5 text-center text-muted">Loading suppliers...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No suppliers found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="transition-colors hover-bg-secondary">
                  <td className="py-3 px-4 text-muted">#{s.id}</td>
                  <td className="py-3 px-4 fw-bold">{s.name}</td>
                  <td className="py-3 px-4">{s.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SuppliersPage;
