import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function PaymentsPage() {
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    apiGet('/payments')
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => { setError('Failed to load payments'); setLoading(false); });
  }, []);
  async function add(e) {
    e.preventDefault();
    const oid = parseInt(orderId, 10);
    const amt = parseFloat(amount);
    if (Number.isNaN(oid) || oid <= 0) return alert('Enter a valid order ID');
    if (Number.isNaN(amt) || amt <= 0) return alert('Enter a valid amount');
    try {
      setSubmitting(true);
      const created = await apiPost('/payments', { order_id: oid, amount: amt, method });
      setItems((prev) => [...prev, created]);
      setOrderId(''); setAmount(''); setMethod('cod');
    } catch (_) {
      alert('Failed to add payment');
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = items.filter((p) =>
    String(p.method || '').toLowerCase().includes(query.toLowerCase()) ||
    String(p.status || '').toLowerCase().includes(query.toLowerCase()) ||
    String(p.order_id).includes(query)
  );
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Payments</h2>
          <p className="text-muted">Review transactions and payment methods.</p>
        </div>
        <button className="btn"><Icons.CreditCard size={18} /> Export CSV</button>
      </div>
      <div className="card p-4 mb-4 bg-secondary">
        <h4 className="mb-3">Add Payment</h4>
        <form onSubmit={add} className="d-flex gap-sm align-end flex-wrap">
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Order ID</label>
            <input className="input w-100" placeholder="123" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
          </div>
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Amount</label>
            <input className="input w-100" placeholder="99.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Method</label>
            <input className="input w-100" placeholder="cod" value={method} onChange={(e) => setMethod(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Payment'}</button>
        </form>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search by method, status, or order ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-5 text-center text-muted">Loading payments...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No payments found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover-bg-secondary">
                  <td className="py-3 px-4 text-muted">#{p.id}</td>
                  <td className="py-3 px-4">#{p.order_id}</td>
                  <td className="py-3 px-4">${(Number(p.amount) || 0).toFixed(2)}</td>
                  <td className="py-3 px-4"><span className={`badge ${p.method}`}>{p.method}</span></td>
                  <td className="py-3 px-4"><span className={`badge ${p.status}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;
