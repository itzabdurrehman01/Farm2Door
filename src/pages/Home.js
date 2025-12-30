import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { useCart } from '../state/CartContext';

function Home() {
  const { add } = useCart();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="d-flex align-center justify-between anim-fade-up min-h-500">
            <div className="hero-content">
              <h1 className="hero-title">
                Fresh <span className="text-primary">Local Food</span><br />
                Delivered to Your Door
              </h1>
              <p className="hero-subtitle">
                Support local farmers and enjoy the freshest seasonal produce, meats, and artisan goods available in North Simcoe.
              </p>
              <div className="d-flex gap-md anim-scale-in">
                <Link className="btn btn-primary btn-lg" to="/catalog">
                  Shop Now
                </Link>
                <Link className="btn btn-outline btn-lg" to="/how-it-works">
                  How It Works
                </Link>
              </div>
            </div>

            <div className="hero-image-container hover-float" />
          </div>
        </div>
      </section>

      <div className="delivery-banner">
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
              { title: 'Fruits & Veg', icon: <Icons.Basket />, slug: 'vegetables' },
              { title: 'Meat & Seafood', icon: <Icons.Fish />, slug: 'meat' },
              { title: 'Dairy & Eggs', icon: <Icons.MilkEggs />, slug: 'dairy' },
              { title: 'Bakery', icon: <Icons.Bread />, slug: 'bakery' },
              { title: 'Pantry', icon: <Icons.Jar />, slug: 'pantry' },
              { title: 'Ready to Eat', icon: <Icons.Salad />, slug: 'pantry' }
            ].map((c) => (
              <Link key={c.title} to={`/catalog?category=${c.slug}`} className="card category-card hover-lift">
                <div className="feature-icon-wrap">{c.icon}</div>
                <h3 className="text-lg m-0">{c.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-50 bg-secondary">
        <div className="container">
          <h2 className="section-title text-center mb-5">Why Choose Farm2Door?</h2>

          <div className="grid grid-3">
            <div className="text-center p-4">
              <div className="feature-icon-wrap mx-auto mb-3"><Icons.Sprout className="feature-icon" /></div>
              <h3>100% Local</h3>
              <p className="text-muted">Every product comes directly from farmers and producers in your community.</p>
            </div>
            <div className="text-center p-4">
              <div className="feature-icon-wrap mx-auto mb-3"><Icons.Tractor className="feature-icon" /></div>
              <h3>Fresh from the Farm</h3>
              <p className="text-muted">Harvested at peak ripeness and delivered fresh to maximize flavor and nutrition.</p>
            </div>
            <div className="text-center p-4">
              <div className="feature-icon-wrap mx-auto mb-3"><Icons.Handshake className="feature-icon" /></div>
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
              { id: 101, name: 'Seasonal Greens Box', price: 24.99, unit: 'Box', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
              { id: 102, name: 'Free-range Eggs', price: 6.49, unit: 'Dozen', image: 'https://images.unsplash.com/photo-1582722878654-02fd235dd7c2?auto=format&fit=crop&w=800&q=80' },
              { id: 103, name: 'Sourdough Bread', price: 7.99, unit: 'Loaf', image: 'https://images.unsplash.com/photo-1585476644321-b976214b606d?auto=format&fit=crop&w=800&q=80' },
              { id: 104, name: 'Wildflower Honey', price: 12.99, unit: '500g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' }
            ].map((s) => (
              <ProductCard key={s.id} product={s} onAdd={add} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
