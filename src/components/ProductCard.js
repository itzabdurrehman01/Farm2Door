function ProductCard({ product, onAdd }) {
  const img = product.image;
  const badge = (product.unit || '').toLowerCase() === 'kg' ? 'Seasonal' : 'New';

  return (
    <div className="card product-card">
      <img
        className="product-image"
        src={img || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-size="22" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">Image unavailable</text></svg>')}`}
        alt={product.name}
        onError={(e) => {
          const svg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-size="22" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">Image unavailable</text></svg>');
          e.currentTarget.src = `data:image/svg+xml;utf8,${svg}`;
        }}
      />

      <div className="product-info">
        <div className="d-flex justify-between align-center mb-2">
          <h3 className="m-0 text-truncate">{product.name}</h3>
          <span className="badge">{badge}</span>
        </div>

        <p className="text-muted m-0 mb-2">{product.unit || 'Per unit'}</p>

        <div className="d-flex align-center gap-sm mb-3">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <span className="text-muted">•</span>
          <span className="text-muted">★★★★☆</span>
        </div>

        <button className="btn add-btn" onClick={() => onAdd(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
