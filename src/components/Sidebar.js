import { NavLink } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { Icons } from './Icons';

function Sidebar({ onClose }) {
  const auth = useAuth();
  const role = auth?.role;
  const LinkItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      onClick={onClose}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
  return (
    <nav>
      <div className="sidebar-section">
        <div className="sidebar-title">Shop</div>
        <LinkItem to="/" icon={<Icons.Package size={16} />} label="Home" />
        <LinkItem to="/catalog" icon={<Icons.Search size={16} />} label="Catalog" />
        <LinkItem to="/cart" icon={<Icons.ShoppingCart size={16} />} label="Cart" />
        <LinkItem to="/checkout" icon={<Icons.CreditCard size={16} />} label="Checkout" />
        <LinkItem to="/orders" icon={<Icons.ShoppingCart size={16} />} label="Orders" />
      </div>
      {role === 'admin' && (
        <div className="sidebar-section">
          <div className="sidebar-title">Admin</div>
          <LinkItem to="/reports" icon={<Icons.BarChart2 size={16} />} label="Dashboard" />
          <LinkItem to="/users" icon={<Icons.Users size={16} />} label="Users" />
          <LinkItem to="/products" icon={<Icons.Package size={16} />} label="Products" />
          <LinkItem to="/suppliers" icon={<Icons.Users size={16} />} label="Suppliers" />
          <LinkItem to="/inventory" icon={<Icons.Package size={16} />} label="Inventory" />
          <LinkItem to="/orders" icon={<Icons.ShoppingCart size={16} />} label="Orders" />
          <LinkItem to="/deliveries" icon={<Icons.ShoppingCart size={16} />} label="Deliveries" />
          <LinkItem to="/payments" icon={<Icons.CreditCard size={16} />} label="Payments" />
          <LinkItem to="/notifications" icon={<Icons.Bell size={16} />} label="Notifications" />
        </div>
      )}
    </nav>
  );
}

export default Sidebar;
