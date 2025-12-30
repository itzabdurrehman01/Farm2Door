import { useState } from 'react';
import { useCart } from '../state/CartContext';
import { apiPost } from '../api';
import { Icons } from '../components/Icons';
import { Link } from 'react-router-dom';

function Checkout() {
  const cart = useCart();
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('delivery');
  const [promo, setPromo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function placeOrder(e) {
    e.preventDefault();
    const discount = promo.trim().toUpperCase() === 'LOCAL10' ? 0.1 : 0;
    const total_amount = Number((cart.total * (1 - discount)).toFixed(2));
    try {
      if (!name.trim() || !phone.trim() || (method === 'delivery' && !address.trim())) throw new Error('Please complete all required fields');
      setSubmitting(true);
      const order = await apiPost('/orders', { user_id: parseInt(userId, 10) || 1, total_amount, status });
      setMessage(`Order #${order.id} placed successfully!`);
      cart.clear();
    } catch (err) { setMessage(err.message || 'Failed to place order'); }
    finally { setSubmitting(false); }
  }

  if (message) {
    return (
      <div className="container section py-50 text-center">
        <div className="card p-5 d-inline-block">
          <div className="text-success mb-3"><Icons.Check size={64} /></div>
          <h2>Thank You!</h2>
          <p className="text-muted mb-4">{message}</p>
          <Link to="/" className="btn btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section py-50">
      <div className="section-header mb-4">
        <h2 className="section-title m-0">Checkout</h2>
      </div>

      <div className="checkout-layout">
        <div className="card p-5">
          <h3 className="mb-4 d-flex align-center gap-sm">
            <div className="bg-brand rounded-circle d-flex align-center justify-center p-0 w-8 h-8 font-medium">1</div>
            Delivery Details
          </h3>

          <form id="checkout-form" onSubmit={placeOrder} className="d-grid gap-md">
            <div className="seg p-1 bg-secondary rounded d-flex mb-2">
              <button type="button" className={`btn flex-1 ${method === 'delivery' ? 'shadow-sm bg-white' : 'text-muted bg-transparent'}`} onClick={() => setMethod('delivery')}>Delivery</button>
              <button type="button" className={`btn flex-1 ${method === 'pickup' ? 'shadow-sm bg-white' : 'text-muted bg-transparent'}`} onClick={() => setMethod('pickup')}>Pickup</button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input w-100" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="input w-100" placeholder="(555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input className="input w-100" placeholder="123 Farm Lane, Tiny, ON" value={address} onChange={(e) => setAddress(e.target.value)} required={method === 'delivery'} disabled={method === 'pickup'} />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">User ID (Simulated)</label>
                <input className="input w-100" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter ID for testing" />
              </div>
              <div className="form-group">
                <label className="form-label">Test Status</label>
                <select className="input w-100" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div>
          <div className="card p-4 sticky-summary">
            <h3 className="mb-3">Order Summary</h3>
            <div className="cart-items-list mb-3">
              {cart.items.map((i) => (
                <div key={i.id} className="d-flex justify-between align-center mb-2 pb-2 border-bottom">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <small className="text-muted">Qty: {i.qty}</small>
                  </div>
                  <div>${((i.price || 0) * i.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label">Promo Code</label>
              <div className="d-flex gap-sm">
                <input className="input flex-1" placeholder="LOCAL10" value={promo} onChange={(e) => setPromo(e.target.value)} />
                <button type="button" className="btn btn-outline">Apply</button>
              </div>
            </div>

            <div className="d-flex justify-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            {promo.trim().toUpperCase() === 'LOCAL10' && (
              <div className="d-flex justify-between mb-2 text-success text-brand">
                <span>Discount (10%)</span>
                <span>-${(cart.total * 0.1).toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-between mb-4">
              <span className="text-xl font-bold">Total</span>
              <span className="text-xl font-bold text-brand">
                ${(cart.total * (promo.trim().toUpperCase() === 'LOCAL10' ? 0.9 : 1)).toFixed(2)}
              </span>
            </div>

            <button className="btn btn-primary w-100 py-3 justify-center" type="submit" form="checkout-form">
              <Icons.CreditCard size={20} className="mr-2" />
              {submitting ? 'Placing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
