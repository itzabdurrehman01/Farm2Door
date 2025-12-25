import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    apiGet('/inventory')
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => { setError('Failed to load inventory'); setLoading(false); });
  }, []);
  async function upsert(e) {
    e.preventDefault();
    const pid = parseInt(productId, 10);
    const qty = parseFloat(quantity);
    if (Number.isNaN(pid) || pid <= 0) return alert('Enter a valid product ID');
    if (Number.isNaN(qty)) return alert('Enter a valid quantity');
    try {
      setSubmitting(true);
      const updated = await apiPost('/inventory', { product_id: pid, quantity: qty, location });
      setItems((prev) => {
        const others = prev.filter((i) => i.product_id !== updated.product_id);
        return [...others, updated];
      });
      setProductId(''); setQuantity(''); setLocation('');
    } catch (_) {
      alert('Failed to save inventory');
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = items.filter((i) =>
    String(i.product_name || '').toLowerCase().includes(query.toLowerCase()) ||
    String(i.location || '').toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Inventory</h2>
          <p className="text-muted">Track stock levels and locations.</p>
        </div>
        <button className="btn"><Icons.Package size={18} /> Stock Audit</button>
      </div>
      <div className="card p-4 mb-4 bg-secondary">
        <h4 className="mb-3">Update Inventory</h4>
        <form onSubmit={upsert} className="d-flex gap-sm align-end flex-wrap">
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Product ID</label>
            <input className="input w-100" placeholder="123" value={productId} onChange={(e) => setProductId(e.target.value)} required />
          </div>
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="d-block text-sm mb-1">Quantity</label>
            <input className="input w-100" placeholder="25" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
          <div className="flex-1" style={{ minWidth: 200 }}>
            <label className="d-block text-sm mb-1">Location</label>
            <input className="input w-100" placeholder="Warehouse A" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search inventory by product or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-5 text-center text-muted">Loading inventory...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No inventory records found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="transition-colors hover-bg-secondary">
                  <td className="py-3 px-4 text-muted">#{i.id}</td>
                  <td className="py-3 px-4">{i.product_name} (#{i.product_id})</td>
                  <td className="py-3 px-4">{i.quantity}</td>
                  <td className="py-3 px-4">{i.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InventoryPage;
