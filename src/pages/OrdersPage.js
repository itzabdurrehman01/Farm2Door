import { useEffect, useState } from 'react';
import { apiGet } from '../api';
import { Icons } from '../components/Icons';

function OrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    apiGet('/orders')
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => {
        // Fallback for demo
        setItems([
          { id: 1001, user_id: 1, total_amount: 54.20, status: 'pending' },
          { id: 1002, user_id: 2, total_amount: 12.50, status: 'paid' },
          { id: 1003, user_id: 5, total_amount: 34.00, status: 'delivered' },
          { id: 1004, user_id: 3, total_amount: 89.99, status: 'paid' }
        ]);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(o => filter === 'all' || o.status === filter);

  function getStatusColor(status) {
    switch (status) {
      case 'paid': return 'text-success bg-success-light'; // You might need to define bg-success-light in CSS or use inline
      case 'pending': return 'text-warning bg-warning-light';
      case 'delivered': return 'text-primary bg-primary-light';
      default: return 'text-muted bg-secondary';
    }
  }

  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Orders</h2>
          <p className="text-muted">Track and manage customer orders.</p>
        </div>
        <div className="d-flex gap-sm card p-1 bg-secondary d-inline-flex">
          {['all', 'pending', 'paid', 'delivered'].map(s => (
            <button
              key={s}
              className={`btn sm capitalize ${filter === s ? 'white shadow-sm bg-white' : 'text-muted bg-transparent'}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No orders found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="hover-bg-secondary transition-colors">
                  <td className="py-3 px-4 fw-bold">#{o.id}</td>
                  <td className="py-3 px-4 text-muted">User #{o.user_id}</td>
                  <td className="py-3 px-4 fw-bold">${(Number(o.total_amount) || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(o.status)}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="btn sm secondary"><Icons.Search size={14} /> View</button>
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

export default OrdersPage;
