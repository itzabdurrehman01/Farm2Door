import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '../api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../state/CartContext';
import { Icons } from '../components/Icons';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(9999);
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const cart = useCart();

  useEffect(() => {
    apiGet('/products')
      .then((r) => { setProducts(r); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  useEffect(() => {
    const q = sp.get('q') || '';
    const c = sp.get('c') || 'all';
    const s = sp.get('s') || 'relevance';
    const pmin = Number(sp.get('pmin') || 0);
    const pmax = Number(sp.get('pmax') || 9999);
    setQuery(q); setCategory(c); setSort(s); setPriceMin(pmin); setPriceMax(pmax);
  }, [sp]);

  useEffect(() => {
    setSp({ q: query, c: category, s: sort, pmin: String(priceMin), pmax: String(priceMax) });
  }, [query, category, sort, priceMin, priceMax, setSp]);

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => category === 'all' ? true : (p.unit || '').toLowerCase() === category)
    .filter((p) => {
      const price = Number(p.price) || 0;
      return price >= priceMin && price <= priceMax;
    });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sort === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sort === 'name') return String(a.name).localeCompare(String(b.name));
    return 0;
  });

  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0" style={{ marginBottom: '0.5rem' }}>Shop Local</h2>
          <p className="text-muted">Explore fresh produce and artisan goods from your community.</p>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="card p-4">
            <div className="d-flex align-center gap-sm mb-3">
              <Icons.Filter size={18} />
              <h4 className="m-0">Filters</h4>
            </div>

            <div className="mb-4">
              <label className="form-label">Search</label>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <input
                  className="input w-100 pl-5"
                  placeholder="Keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
                <div style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }}>
                  <Icons.Search size={16} />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Category</label>
              <div className="filter-options d-flex flex-column gap-sm">
                {['all', 'kg', 'dozen', 'pack', 'unit'].map(c => (
                  <button
                    key={c}
                    className={`btn ${category === c ? 'btn-primary' : 'btn-outline'} sm text-left justify-between`}
                    onClick={() => setCategory(c)}
                    style={{ border: category === c ? 'none' : '1px solid #e2e8f0', color: category === c ? 'white' : 'var(--text-main)' }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{c}</span>
                    {category === c && <Icons.Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Price Range</label>
              <div className="d-flex align-center gap-sm">
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Math.max(0, Number(e.target.value)))}
                  style={{ maxWidth: 120 }}
                  placeholder="Min"
                />
                <span className="text-muted">to</span>
                <input
                  className="input"
                  type="number"
                  min={priceMin}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Math.max(priceMin, Number(e.target.value)))}
                  style={{ maxWidth: 120 }}
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Sort By</label>
              <select className="input w-100" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-results">
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 300 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-5 text-center">
              <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Icons.Search size={48} />
              </div>
              <h3>No products found</h3>
              <p className="text-muted">Try adjusting your search or filters to find what you're looking for.</p>
              <button className="btn btn-outline mt-3" onClick={() => { setQuery(''); setCategory('all'); }}>Clear Filters</button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-md">
              <div className="d-flex justify-between align-center">
                <span className="text-muted">{filtered.length} products found</span>
                <div className="d-flex gap-sm flex-wrap">
                  {query && (
                    <button className="btn secondary sm" onClick={() => setQuery('')}>
                      “{query}” ×
                    </button>
                  )}
                  {category !== 'all' && (
                    <button className="btn secondary sm" onClick={() => setCategory('all')}>
                      {category} ×
                    </button>
                  )}
                  {(priceMin > 0 || priceMax < 9999) && (
                    <button className="btn secondary sm" onClick={() => { setPriceMin(0); setPriceMax(9999); }}>
                      ${priceMin}–${priceMax} ×
                    </button>
                  )}
                </div>
              </div>
              <div className="products-grid">
                {sorted.map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={(item) => cart.add(item)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
