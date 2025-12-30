import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { Icons } from '../components/Icons';

function ProductsPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    apiGet('/products')
      .then((d) => { setItems(d); setLoading(false); })
      .catch((e) => {
        // Fallback for demo
        setItems([
          { id: 101, name: 'Seasonal Greens Box', price: 24.99, unit: 'Box' },
          { id: 102, name: 'Free-range Eggs', price: 6.49, unit: 'Dozen' },
          { id: 103, name: 'Sourdough Bread', price: 7.99, unit: 'Loaf' },
          { id: 104, name: 'Wildflower Honey', price: 12.99, unit: '500g' }
        ]);
        setLoading(false);
      });
  }, []);
  async function addProduct(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Name is required');
    const p = parseFloat(price);
    if (Number.isNaN(p) || p <= 0) return alert('Enter a valid price');
    try {
      setSubmitting(true);
      const created = await apiPost('/products', { name, price: p, unit });
      setItems((prev) => [...prev, created]);
      setName(''); setPrice(''); setUnit('kg');
    } catch (_) {
      alert('Failed to add product');
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    String(p.unit || '').toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Products</h2>
          <p className="text-muted">Manage products available in the catalog.</p>
        </div>
        <button className="btn" onClick={() => {}}>
          <Icons.Package size={18} /> Manage Categories
        </button>
      </div>
      <div className="card p-4 mb-4 bg-secondary">
        <h4 className="mb-3">Add New Product</h4>
        <form onSubmit={addProduct} className="d-flex gap-sm align-end flex-wrap">
          <div className="flex-1 min-w-200">
            <label className="d-block text-sm mb-1">Name</label>
            <input className="input w-100" placeholder="Organic Apples" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex-1 min-w-160">
            <label className="d-block text-sm mb-1">Price</label>
            <input className="input w-100" placeholder="9.99" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="flex-1 min-w-140">
            <label className="d-block text-sm mb-1">Unit</label>
            <input className="input w-100" placeholder="kg" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Product'}</button>
        </form>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex align-center gap-sm">
          <Icons.Search size={18} className="text-muted" />
          <input
            className="input-transparent w-100"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-5 text-center text-muted">Loading products...</div>
        ) : error ? (
          <div className="p-5 text-center text-muted">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">No products found.</div>
        ) : (
          <table className="table w-100 mb-0">
            <thead>
              <tr className="bg-secondary text-sm uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover-bg-secondary">
                  <td className="py-3 px-4 text-muted">#{p.id}</td>
                  <td className="py-3 px-4 fw-bold">{p.name}</td>
                  <td className="py-3 px-4">${(Number(p.price) || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
