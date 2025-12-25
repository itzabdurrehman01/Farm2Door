import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function DeliveriesPage() {
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('preparing');
  const [eta, setEta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    apiGet('/deliveries')
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => { setError('Failed to load deliveries'); setLoading(false); });
  }, []);
  async function add(e) {
    e.preventDefault();
    const oid = parseInt(orderId, 10);
    if (Number.isNaN(oid) || oid <= 0) return alert('Enter a valid order ID');
    try {
      setSubmitting(true);
      const created = await apiPost('/deliveries', { order_id: oid, status, eta });
      setItems((prev) => [...prev, created]);
      setOrderId(''); setStatus('preparing'); setEta('');
    } catch (_) {
      alert('Failed to add delivery');
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = items.filter((d) =>
    String(d.status || '').toLowerCase().includes(query.toLowerCase()) ||
    String(d.order_id).includes(query)
  );
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Deliveries</h2>
          <p className="text-muted">Schedule and track delivery orders.</p>
        </div>
        <button className="btn"><Icons.Truck size={18} /> Print Manifests</button>
      </div>
      <div className="card p-4 mb-4 bg-secondary">
        <h4 className="mb-3">Add Delivery</h4>
        <form onSubmit={add} className="d-flex gap-sm align-end flex-wrap">
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Order ID</label>
            <input className="input w-100" placeholder="123" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
          </div>
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Status</label>
            <input className="input w-100" placeholder="preparing" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div className="flex-1" style={{ minWidth: 220 }}>
            <label className="d-block text-sm mb-1">ETA (YYYY-MM-DD HH:MM)</label>
            <input className="input w-100" placeholder="2025-01-01 12:00" value={eta} onChange={(e) => setEta(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Delivery'}</button>
        </form>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search by status or order ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-5 text-center text-muted">Loading deliveries...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No deliveries found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="transition-colors hover-bg-secondary">
                  <td className="py-3 px-4 text-muted">#{d.id}</td>
                  <td className="py-3 px-4">#{d.order_id}</td>
                  <td className="py-3 px-4"><span className={`badge ${d.status}`}>{d.status}</span></td>
                  <td className="py-3 px-4">{d.eta || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DeliveriesPage;
