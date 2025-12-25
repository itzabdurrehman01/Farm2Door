import { useCart } from '../state/CartContext';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

function Cart() {
  const cart = useCart();
  return (
    <div className="container section py-50">
      <div className="section-header mb-4">
        <h2 className="section-title m-0">Your Shopping Cart</h2>
      </div>

      {cart.items.length === 0 ? (
        <div className="card p-5 text-center">
          <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Icons.ShoppingCart size={48} />
          </div>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
          <Link className="btn btn-primary" to="/catalog">Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="card p-0 overflow-hidden text-sm">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th className="pl-5">Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th className="text-right pr-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((i) => (
                  <tr key={i.id}>
                    <td className="pl-5">
                      <div className="d-flex align-center gap-md">
                        {i.image && (
                          <div
                            style={{
                              width: 48, height: 48,
                              borderRadius: 8,
                              backgroundImage: `url(${i.image})`,
                              backgroundSize: 'cover',
                              backgroundColor: '#eee'
                            }}
                          />
                        )}
                        <div>
                          <div className="fw-bold">{i.name}</div>
                          <small className="text-muted">{i.unit}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-center gap-sm">
                        <button
                          className="btn btn-outline sm p-1"
                          onClick={() => cart.setQty(i.id, Math.max(1, i.qty - 1))}
                        >
                          <Icons.Minus size={14} />
                        </button>
                        <input
                          className="input text-center"
                          type="number"
                          min="1"
                          value={i.qty}
                          onChange={(e) => cart.setQty(i.id, parseInt(e.target.value, 10) || 1)}
                          style={{ width: 50, padding: 4 }}
                        />
                        <button
                          className="btn btn-outline sm p-1"
                          onClick={() => cart.setQty(i.id, i.qty + 1)}
                        >
                          <Icons.Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="fw-bold text-primary">${((i.price || 0) * i.qty).toFixed(2)}</td>
                    <td className="text-right pr-5">
                      <button
                        className="btn sm text-error"
                        onClick={() => cart.remove(i.id)}
                        title="Remove Item"
                        style={{ background: 'none' }}
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="card p-4 sticky-summary">
              <h3 className="mb-3">Order Summary</h3>
              <div className="d-flex justify-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-between mb-4">
                <span className="text-muted">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="mb-3" style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />
              <div className="d-flex justify-between mb-4">
                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  ${cart.total.toFixed(2)}
                </span>
              </div>
              <Link className="btn btn-primary w-100 justify-center" to="/checkout">
                Proceed to Checkout
              </Link>
              <Link className="d-block text-center mt-3 text-muted" to="/catalog">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
