import { useEffect, useState } from 'react';
import { apiGet } from '../api';
import { Icons } from '../components/Icons';

function OrderTimeline({ status }) {
  const steps = ['pending', 'paid', 'shipped', 'delivered'];
  const currentIdx = steps.indexOf(status) === -1 ? 0 : steps.indexOf(status);

  return (
    <div className="order-timeline my-4">
      <div className="d-flex justify-between relative" style={{ position: 'relative' }}>
        {/* Progress Bar Background */}
        <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: '4px', background: '#e5e7eb', zIndex: 0 }}></div>
        {/* Active Progress Bar */}
        <div style={{ 
          position: 'absolute', top: '12px', left: 0, 
          width: `${(currentIdx / (steps.length - 1)) * 100}%`, 
          height: '4px', background: 'var(--primary)', zIndex: 0, transition: 'width 0.3s ease' 
        }}></div>

        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCompleted = idx < currentIdx;
          
          return (
            <div key={step} className="text-center relative" style={{ zIndex: 1, width: '40px' }}>
              <div 
                className="d-flex align-center justify-center rounded-circle mx-auto mb-2"
                style={{ 
                  width: '28px', height: '28px', 
                  background: isActive ? 'var(--primary)' : '#e5e7eb',
                  color: isActive ? '#fff' : '#9ca3af',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {isCompleted ? <Icons.Check size={14} /> : (idx + 1)}
              </div>
              <span className="text-xs uppercase font-bold" style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    apiGet('/orders')
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => {
        // Fallback for demo
        setItems([
          { id: 1001, user_id: 1, total_amount: 54.20, status: 'pending', date: '2023-10-25' },
          { id: 1002, user_id: 2, total_amount: 12.50, status: 'paid', date: '2023-10-24' },
          { id: 1003, user_id: 5, total_amount: 34.00, status: 'delivered', date: '2023-10-20' },
          { id: 1004, user_id: 3, total_amount: 89.99, status: 'paid', date: '2023-10-22' }
        ]);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(o => filter === 'all' || o.status === filter);

  function getStatusColor(status) {
    switch (status) {
      case 'paid': return 'text-success bg-success-light';
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
          <div className="p-5">
            <div className="skeleton" style={{ height: 24, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 24, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 24 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No orders found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="hover-bg-secondary transition-colors" style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)}>
                  <td className="py-3 px-4 fw-bold">#{o.id}</td>
                  <td className="py-3 px-4 text-muted">{o.date || 'Today'}</td>
                  <td className="py-3 px-4 text-muted">User #{o.user_id}</td>
                  <td className="py-3 px-4 fw-bold">PKR{(Number(o.total_amount) || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(o.status)}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="btn sm secondary" onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}>
                      <Icons.Search size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setSelectedOrder(null)}>
          <div className="modal-content card p-0 overflow-hidden anim-scale-in" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-bottom d-flex justify-between align-center bg-secondary">
              <h3 className="m-0">Order #{selectedOrder.id}</h3>
              <button className="btn sm btn-outline" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            
            <div className="p-5">
              <div className="mb-5">
                <h4 className="text-muted text-sm uppercase mb-3">Order Status</h4>
                <OrderTimeline status={selectedOrder.status} />
              </div>

              <div className="d-grid grid-2 gap-lg mb-5">
                <div>
                  <h4 className="text-muted text-sm uppercase mb-2">Customer Info</h4>
                  <div className="p-3 bg-secondary rounded">
                    <div className="fw-bold">User #{selectedOrder.user_id}</div>
                    <div className="text-muted text-sm">customer@example.com</div>
                    <div className="text-muted text-sm">+92 300 1234567</div>
                  </div>
                </div>
                <div>
                   <h4 className="text-muted text-sm uppercase mb-2">Payment Info</h4>
                   <div className="p-3 bg-secondary rounded">
                    <div className="d-flex justify-between mb-1">
                      <span className="text-muted">Subtotal:</span>
                      <span>PKR{selectedOrder.total_amount}</span>
                    </div>
                    <div className="d-flex justify-between mb-1">
                      <span className="text-muted">Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="d-flex justify-between fw-bold border-top pt-2 mt-2">
                      <span>Total:</span>
                      <span className="text-primary">PKR{selectedOrder.total_amount}</span>
                    </div>
                   </div>
                </div>
              </div>

              <div>
                <h4 className="text-muted text-sm uppercase mb-3">Order Items (Mock)</h4>
                <div className="border rounded overflow-hidden">
                  <div className="d-flex align-center p-3 border-bottom">
                    <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 8, marginRight: 16 }}></div>
                    <div className="flex-1">
                      <div className="fw-bold">Organic Vegetables Bundle</div>
                      <div className="text-muted text-sm">Fresh Farm Box</div>
                    </div>
                    <div className="fw-bold text-right">
                      <div>PKR24.50</div>
                      <div className="text-muted text-xs">Qty: 1</div>
                    </div>
                  </div>
                   <div className="d-flex align-center p-3">
                    <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 8, marginRight: 16 }}></div>
                    <div className="flex-1">
                      <div className="fw-bold">Local Honey</div>
                      <div className="text-muted text-sm">Pure & Raw</div>
                    </div>
                    <div className="fw-bold text-right">
                      <div>PKR12.00</div>
                      <div className="text-muted text-xs">Qty: 2</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-secondary text-right">
              <button className="btn btn-outline mr-2" onClick={() => window.print()}>Print Invoice</button>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
