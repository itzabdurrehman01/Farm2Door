import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="d-flex align-center justify-between anim-fade-up" style={{ minHeight: '500px' }}>
            <div className="hero-content">
              <h1 className="hero-title">
                Fresh <span className="text-primary">Local Food</span><br />
                Delivered to Your Door
              </h1>
              <p className="hero-subtitle">
                Support local farmers and enjoy the freshest seasonal produce, meats, and artisan goods available in North Simcoe.
              </p>
              <div className="d-flex gap-md anim-scale-in">
                <Link className="btn btn-primary" to="/catalog" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                  Shop Now
                </Link>
                <Link className="btn btn-outline" to="/how-it-works" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                  How It Works
                </Link>
              </div>
            </div>

            <div className="hero-image-container hover-float" />
          </div>
        </div>
      </section>

      <div className="delivery-banner" style={{
        background: 'var(--primary)',
        color: 'white',
        padding: '12px 0',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontWeight: 600
      }}>
        <div className="container">
          <span className="d-inline-flex align-center gap-sm"><Icons.Truck /> Delivering to: Tiny, Tay, Midland & Penetanguishene</span>
        </div>
      </div>

      <section className="section py-50">
        <div className="container">
          <div className="section-header d-flex justify-between align-center mb-4">
            <h2 className="section-title m-0">Shop by Category</h2>
            <Link to="/catalog" className="text-muted hover-primary">View All →</Link>
          </div>

          <div className="products-grid">
            {[
              { title: 'Fruits & Veg', icon: <Icons.Basket /> },
              { title: 'Meat & Seafood', icon: <Icons.Fish /> },
              { title: 'Dairy & Eggs', icon: <Icons.MilkEggs /> },
              { title: 'Bakery', icon: <Icons.Bread /> },
              { title: 'Pantry', icon: <Icons.Jar /> },
              { title: 'Ready to Eat', icon: <Icons.Salad /> }
            ].map((c) => (
              <Link key={c.title} to="/catalog" className="card category-card text-center p-4 hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="feature-icon-wrap" style={{ marginBottom: '1rem' }}>{c.icon}</div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{c.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-50 bg-secondary" style={{ background: 'var(--secondary)' }}>
        <div className="container">
          <h2 className="section-title text-center mb-5">Why Choose Farm2Door?</h2>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div className="text-center p-4">
              <div className="feature-icon-wrap"><Icons.Sprout className="feature-icon" /></div>
              <h3>100% Local</h3>
              <p className="text-muted">Every product comes directly from farmers and producers in your community.</p>
            </div>
            <div className="text-center p-4">
              <div className="feature-icon-wrap"><Icons.Tractor className="feature-icon" /></div>
              <h3>Fresh from the Farm</h3>
              <p className="text-muted">Harvested at peak ripeness and delivered fresh to maximize flavor and nutrition.</p>
            </div>
            <div className="text-center p-4">
              <div className="feature-icon-wrap"><Icons.Handshake className="feature-icon" /></div>
              <h3>Fair to Producers</h3>
              <p className="text-muted">We ensure our local partners get a fair share, helping our local economy thrive.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-50">
        <div className="container">
          <h2 className="section-title mb-4">Customer Favorites</h2>
          <div className="products-grid">
            {[
              { title: 'Seasonal Greens Box', price: 24.99, unit: 'Box', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
              { title: 'Free-range Eggs', price: 6.49, unit: 'Dozen', image: 'https://images.unsplash.com/photo-1582722878654-02fd235dd7c2?auto=format&fit=crop&w=800&q=80' },
              { title: 'Sourdough Bread', price: 7.99, unit: 'Loaf', image: 'https://images.unsplash.com/photo-1585476644321-b976214b606d?auto=format&fit=crop&w=800&q=80' },
              { title: 'Wildflower Honey', price: 12.99, unit: '500g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' }
            ].map((s, i) => (
              <div key={i} className="card product-card anim-scale-in">
                <img
                  className="product-image"
                  src={s.image}
                  alt={s.title}
                  onError={(e) => {
                    const svg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-size="22" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">Image unavailable</text></svg>');
                    e.currentTarget.src = `data:image/svg+xml;utf8,${svg}`;
                  }}
                />
                <div className="product-info">
                  <h3>{s.title}</h3>
                  <p className="text-muted">{s.unit}</p>
                  <div className="d-flex justify-between align-center mt-3">
                    <span className="product-price">${s.price}</span>
                    <Link to="/catalog" className="btn btn-primary sm">Add</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
