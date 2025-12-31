import { Link } from "react-router-dom";
import { Icons } from "./Icons";
import { useAuth } from "../state/AuthContext";

function Footer() {
  const auth = useAuth();
  const role = auth?.role;
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-top" role="navigation" aria-label="Footer">
          <div className="footer-brand" aria-labelledby="footer-brand">
            <div id="footer-brand" className="brand">
              <span className="d-flex align-center gap-sm">
                <Icons.LogoMark />
                <span>Farm2Door Pakistan</span>
              </span>
            </div>
            <p className="muted">Fresh food delivered direct from local Pakistani farms.</p>
            <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
              <input className="input" type="email" placeholder="Your email for fresh updates" aria-label="Email address" />
              <button className="btn">Subscribe</button>
            </form>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <div className="footer-title" id="footer-shop">Shop</div>
              <ul>
                <li><Link className="footer-link" to="/catalog">Shop</Link></li>
                <li><Link className="footer-link" to="/cart">Cart</Link></li>
                <li><Link className="footer-link" to="/checkout">Checkout</Link></li>
                <li><Link className="footer-link" to="/producers">Producers</Link></li>
              </ul>
            </div>
            {role === 'admin' && (
              <div className="footer-col">
                <div className="footer-title" id="footer-admin">Admin</div>
                <ul>
                  <li><Link className="footer-link" to="/reports">Reports</Link></li>
                  <li><Link className="footer-link" to="/notifications">Announcements</Link></li>
                  <li><Link className="footer-link" to="/deliveries">Deliveries</Link></li>
                  <li><Link className="footer-link" to="/payments">Payments</Link></li>
                </ul>
              </div>
            )}
            <div className="footer-col">
              <div className="footer-title" id="footer-about">About</div>
              <ul>
                <li><Link className="footer-link" to="/about">About</Link></li>
                <li><Link className="footer-link" to="/how-it-works">How It Works</Link></li>
                <li><Link className="footer-link" to="/faq">FAQ</Link></li>
                <li><Link className="footer-link" to="/contact">Contact</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-row">
            <div className="legal-links">
              <Link className="footer-link" to="/privacy">Privacy Policy</Link>
              <span>•</span>
              <Link className="footer-link" to="/terms">Terms & Conditions</Link>
              <span>•</span>
              <Link className="footer-link" to="/contact">Contact</Link>
            </div>
            <div className="social-row">
              <button type="button" aria-label="Twitter" className="social-btn">
                <Icons.Twitter />
              </button>
              <button type="button" aria-label="Instagram" className="social-btn">
                <Icons.Instagram />
              </button>
              <button type="button" aria-label="Facebook" className="social-btn">
                <Icons.Facebook />
              </button>
            </div>
          </div>
          <div className="copyright">© {new Date().getFullYear()} Farm2Door Pakistan</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
