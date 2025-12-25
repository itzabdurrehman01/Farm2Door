import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useCart } from '../state/CartContext';
import { apiGet } from '../api';
import { Icons } from './Icons';
import { useTheme } from '../state/ThemeContext';

function NavBar({ onToggle, onThemeToggle }) {
  const [openMiniCart, setOpenMiniCart] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cart = useCart();
  const navigate = useNavigate();
  const auth = useAuth();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    apiGet('/products')
      .then(setAllProducts)
      .catch(() => setAllProducts([]));
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function goCatalog(e) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    navigate(`/catalog?q=${encodeURIComponent(query)}`);
    setSuggestions([]);
  }

  function onLogout() {
    auth.logout();
    navigate('/');
  }

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="d-flex align-center gap-md">
          {auth.user && (
            <button className="nav-toggle-btn" onClick={onToggle} aria-label="Toggle Sidebar">
              <Icons.Menu size={24} />
            </button>
          )}
          <Link to="/" className="brand-logo d-flex align-center gap-sm">
            <Icons.LogoMark />
            <span>Farm2Door</span>
          </Link>
        </div>

        <div className="search-bar-wrapper">
          <form onSubmit={goCatalog} className="search-form">
            <input
              type="text"
              placeholder="Search fresh products..."
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (val.trim()) {
                  const s = allProducts.filter((p) => p.name.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
                  setSuggestions(s);
                } else {
                  setSuggestions([]);
                }
              }}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Icons.Search size={20} />
            </button>
          </form>

          {(query.trim() || suggestions.length > 0) && (
            <div className="search-suggestions">
              {suggestions.length === 0 ? (
                <div className="suggestion-item no-results" onClick={() => goCatalog()}>
                  No matches. Press Enter to search.
                </div>
              ) : (
                suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/catalog?q=${encodeURIComponent(s.name)}`);
                      setQuery('');
                      setSuggestions([]);
                    }}
                  >
                    {s.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <nav className="nav-links d-flex align-center gap-md">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/catalog" className="nav-link">Shop</NavLink>
          <button
            className="icon-btn"
            aria-label="Toggle theme"
            onClick={() => (onThemeToggle ? onThemeToggle() : toggle())}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          {(!auth.user || auth.role === 'customer') && (
            <div className="cart-wrapper">
              <button className="icon-btn" onClick={() => setOpenMiniCart((v) => !v)}>
                <Icons.ShoppingCart size={24} />
                {cart.items.length > 0 && <span className="cart-badge">{cart.items.length}</span>}
              </button>

              {openMiniCart && (
                <div className="mini-cart-dropdown card">
                  <div className="d-flex justify-between align-center mb-2">
                    <h4 className="m-0">Your Cart</h4>
                    <button className="close-btn" onClick={() => setOpenMiniCart(false)}>×</button>
                  </div>

                  {cart.items.length === 0 ? (
                    <div className="text-muted text-center py-4">Your cart is empty</div>
                  ) : (
                    <div className="cart-items-list">
                      {cart.items.map((i) => (
                        <div className="cart-item-row" key={i.id}>
                          <div className="item-info">
                            <div className="item-name">{i.name}</div>
                            <div className="item-price">${(i.price || 0).toFixed(2)} x {i.qty}</div>
                          </div>
                          <button className="remove-btn" onClick={() => cart.remove(i.id)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.items.length > 0 && (
                    <>
                      <div className="cart-total d-flex justify-between">
                        <span>Total:</span>
                        <span className="fw-bold">${cart.total.toFixed(2)}</span>
                      </div>
                      <div className="cart-actions d-grid gap-sm">
                        <Link className="btn block" to="/checkout" onClick={() => setOpenMiniCart(false)}>Checkout</Link>
                        <Link className="btn secondary block" to="/cart" onClick={() => setOpenMiniCart(false)}>View Cart</Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {auth.user ? (
            <div className="user-menu-wrapper">
              <button className="user-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="avatar-placeholder">{auth.user.name[0]}</div>
                <span className="user-name">
                  {auth.user.name}
                  <span className="role-chip">{auth.role}</span>
                </span>
              </button>
              {isMenuOpen && (
                <div className="user-dropdown card">
                  <div className="user-info-header">
                    <div>{auth.user.email}</div>
                    <small className="text-muted">{auth.role}</small>
                  </div>
                  <hr />
                  {auth.role === 'admin' && (
                    <>
                      <Link to="/reports" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      <Link to="/users" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                    </>
                  )}
                  <Link to="/orders" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                  <hr />
                  <button className="dropdown-item text-danger" onClick={onLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons d-flex gap-sm">
              <Link to="/login" className="btn secondary">Login</Link>
              <Link to="/register" className="btn">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
