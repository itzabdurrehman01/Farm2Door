import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '../api';
import ProductCard from '../components/ProductCard';
import { Icons } from '../components/Icons';
import { useCart } from '../state/CartContext';

function Catalog() {
  const { add } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  
  const category = searchParams.get('category') || 'all';
  const setCategory = (c) => {
    if (c === 'all') searchParams.delete('category');
    else searchParams.set('category', c);
    setSearchParams(searchParams);
  };

  const [sort, setSort] = useState('name');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);

  useEffect(() => {
    apiGet('/products')
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else if (data && data.products) setProducts(data.products);
        else setProducts([]);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        // Fallback data for demo
        setProducts([
          { id: 1, name: 'Organic Carrots', price: 2.99, unit: 'bunch', category: 'vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
          { id: 2, name: 'Sourdough Bread', price: 6.50, unit: 'loaf', category: 'bakery', image: 'https://images.unsplash.com/photo-1585476644321-b976214b606d?auto=format&fit=crop&w=800&q=80' },
          { id: 3, name: 'Free-range Eggs', price: 5.99, unit: 'dozen', category: 'dairy', image: 'https://images.unsplash.com/photo-1582722878654-02fd235dd7c2?auto=format&fit=crop&w=800&q=80' },
          { id: 4, name: 'Local Honey', price: 12.00, unit: 'jar', category: 'pantry', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
          { id: 5, name: 'Fresh Strawberries', price: 4.99, unit: 'basket', category: 'fruit', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80' },
          { id: 6, name: 'Artisan Cheese', price: 9.99, unit: 'block', category: 'dairy', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80' }
        ]);
      });
  }, []);

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => category === 'all' ? true : (p.category || '').toLowerCase() === category)
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
    <div className="container py-50">
      <div className="d-flex align-center justify-between mb-5">
        <div>
          <h1 className="mb-2">Shop Local</h1>
          <p className="text-muted">Fresh products from your community</p>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar card p-4 h-fit">
          <div className="mb-4 search-input-wrapper">
            <Icons.Search className="search-icon" />
            <input
              type="text"
              className="input pl-5"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Categories</h3>
            <div className="filter-options">
              {['all', 'vegetables', 'fruit', 'bakery', 'dairy', 'meat', 'pantry'].map((c) => (
                <button
                  key={c}
                  className={`btn sm justify-start capitalize ${category === c ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Price Range</h3>
            <div className="d-flex align-center gap-sm mb-2">
              <input
                type="number"
                className="input sm"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                min="0"
              />
              <span className="text-muted">-</span>
              <input
                type="number"
                className="input sm"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                min="0"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Sort By</h3>
            <select
              className="input w-full"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="products-grid">
          {sorted.length > 0 ? (
            sorted.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={add} />
            ))
          ) : (
            <div className="col-span-full text-center py-50">
              <div className="text-muted mb-3">
                <Icons.Search size={48} className="opacity-20" />
              </div>
              <h3>No products found</h3>
              <p className="text-muted">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
