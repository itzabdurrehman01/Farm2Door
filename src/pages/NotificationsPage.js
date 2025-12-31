import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('queued');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    apiGet('/notifications')
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => { setError('Failed to load notifications'); setLoading(false); });
  }, []);
  async function add(e) {
    e.preventDefault();
    const uid = userId ? parseInt(userId, 10) : null;
    if (!message.trim()) return alert('Message is required');
    try {
      setSubmitting(true);
      const created = await apiPost('/notifications', { user_id: uid, message, status });
      setItems((prev) => [...prev, created]);
      setUserId(''); setMessage(''); setStatus('queued');
    } catch (_) {
      alert('Failed to add notification');
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = items.filter((n) =>
    String(n.message || '').toLowerCase().includes(query.toLowerCase()) ||
    String(n.status || '').toLowerCase().includes(query.toLowerCase()) ||
    String(n.user_id || '').includes(query)
  );
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Notifications</h2>
          <p className="text-muted">Send updates to users and monitor status.</p>
        </div>
        <button className="btn"><Icons.Send size={18} /> Send Broadcast</button>
      </div>
      <div className="card p-4 mb-4 bg-secondary">
        <h4 className="mb-3">Create Notification</h4>
        <form onSubmit={add} className="form-grid">
          <div>
            <label className="d-block text-sm mb-1">User ID (optional)</label>
            <input className="input w-100" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div>
            <label className="d-block text-sm mb-1">Message</label>
            <input className="input w-100" placeholder="Your order is on the way" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <div>
            <label className="d-block text-sm mb-1">Status</label>
            <input className="input w-100" placeholder="queued" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div>
            <button className="btn w-100" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Notification'}</button>
          </div>
        </form>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search by user, message, or status..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-5 text-center text-muted">Loading notifications...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No notifications found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="transition-colors hover-bg-secondary">
                  <td className="py-3 px-4 text-muted">#{n.id}</td>
                  <td className="py-3 px-4">{n.user_id || '-'}</td>
                  <td className="py-3 px-4">{n.message}</td>
                  <td className="py-3 px-4"><span className={`badge ${n.status}`}>{n.status}</span></td>
                  <td className="py-3 px-4">{n.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
