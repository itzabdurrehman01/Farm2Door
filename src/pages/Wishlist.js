import { useWishlist } from '../state/WishlistContext';
import { useCart } from '../state/CartContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Icons } from '../components/Icons';

function Wishlist() {
  const { items, clear } = useWishlist();
  const { add } = useCart();

  return (
    <div className="container py-50">
      <div className="d-flex align-center justify-between mb-5">
        <div>
          <h1 className="mb-2">My Wishlist</h1>
          <p className="text-muted">{items.length} items saved for later</p>
        </div>
        {items.length > 0 && (
          <button className="btn btn-outline sm" onClick={clear}>
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-5 text-center">
          <div className="mb-4">
            <Icons.Heart size={48} className="text-muted opacity-50" />
          </div>
          <h2 className="mb-2">Your wishlist is empty</h2>
          <p className="text-muted mb-4">Save items you love to find them easily later.</p>
          <Link to="/catalog" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-md">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={add} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
