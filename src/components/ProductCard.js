import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { useWishlist } from '../state/WishlistContext';

function ProductCard({ product, onAdd }) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { toggle, isInWishlist } = useWishlist();
  const img = product.image;
  const badge = (product.unit || '').toLowerCase() === 'kg' ? 'Seasonal' : 'New';
  const isWishlisted = isInWishlist(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(product);
    navigate('/cart');
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggle(product);
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <>
      <div className="card product-card" onClick={toggleDetails} style={{ cursor: 'pointer', position: 'relative' }}>
        <button 
          className={`btn-icon ${isWishlisted ? 'text-danger' : 'text-muted'}`}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
          onClick={handleWishlist}
        >
          <Icons.Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <img
          className="product-image"
          src={img || `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`;
          }}
        />

        <div className="product-info">
          <div className="d-flex justify-between align-center mb-2">
            <h3 className="m-0 text-truncate">{product.name}</h3>
            <span className="badge">{badge}</span>
          </div>

          <p className="text-muted m-0 mb-2">{product.unit || 'Per unit'}</p>

          <div className="d-flex align-center gap-sm mb-3">
            <span className="product-price">PKR{Number(product.price).toFixed(2)}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">★★★★☆</span>
          </div>

          <button className="btn add-btn" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="modal-overlay" onClick={toggleDetails} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="modal-content card p-4" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
            <div className="d-flex justify-between align-center mb-3">
              <h2 className="m-0">{product.name}</h2>
              <button className="btn sm btn-outline" onClick={toggleDetails}>✕</button>
            </div>
            <img 
              src={img || `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`} 
              alt={product.name} 
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
            <div className="d-flex justify-between mb-3">
              <span className="badge badge-primary">{product.category || 'General'}</span>
              <span className="fw-bold text-primary">PKR{Number(product.price).toFixed(2)} / {product.unit}</span>
            </div>
            <p className="text-muted mb-4">
              {product.description || `Fresh ${product.name} sourced directly from local farmers. High quality and organically grown.`}
            </p>

            <div className="mb-4">
              <h4 className="mb-2">Customer Reviews</h4>
              <div className="d-flex gap-sm mb-2">
                <div className="card p-2 w-full bg-secondary">
                  <div className="d-flex justify-between">
                    <span className="font-bold text-sm">Sarah J.</span>
                    <span className="text-accent text-sm">★★★★★</span>
                  </div>
                  <p className="text-xs text-muted m-0 mt-1">"Absolutely fresh and delicious! Will buy again."</p>
                </div>
                <div className="card p-2 w-full bg-secondary">
                  <div className="d-flex justify-between">
                    <span className="font-bold text-sm">Mike T.</span>
                    <span className="text-accent text-sm">★★★★☆</span>
                  </div>
                  <p className="text-xs text-muted m-0 mt-1">"Great quality, fast delivery."</p>
                </div>
              </div>
            </div>

            <div className="d-flex gap-md">
              <button className="btn btn-primary block" onClick={handleAdd}>
                Add to Cart
              </button>
              <button className="btn secondary block" onClick={toggleDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
