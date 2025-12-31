import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useTheme } from '../state/ThemeContext';
import { Icons } from '../components/Icons';
import { Link } from 'react-router-dom';
import { useToast } from '../state/ToastContext';

function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const toast = useToast();

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const tabs = isAdmin
    ? [
      { id: 'overview', label: 'Overview', icon: Icons.User },
      { id: 'manage', label: 'Manage', icon: Icons.Users },
      { id: 'settings', label: 'Settings', icon: Icons.Lock },
      ]
    : [
      { id: 'overview', label: 'Overview', icon: Icons.User },
      { id: 'orders', label: 'My Orders', icon: Icons.Package },
      { id: 'settings', label: 'Settings', icon: Icons.Lock },
      ];

  // Dummy data for orders
  const orders = [
    { id: '1001', date: '2023-10-25', total: 54.20, status: 'Processing' },
    { id: '1002', date: '2023-10-15', total: 12.50, status: 'Delivered' },
    { id: '1003', date: '2023-09-28', total: 34.00, status: 'Delivered' },
  ];

  return (
    <div className="container py-50">
      <div className="card p-0 mb-4 overflow-hidden">
        <div
          className="p-5"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(21,32,43,1) 0%, rgba(40,62,80,1) 100%)'
              : 'linear-gradient(135deg, rgba(235,248,240,1) 0%, rgba(209,244,223,1) 100%)'
          }}
        >
          <div className="d-flex align-center justify-between wrap-md">
            <div className="d-flex align-center gap-md">
              <div className="avatar-placeholder xl" style={{ width: 80, height: 80, fontSize: '2rem', background: 'rgba(255,255,255,0.15)' }}>
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <h2 className="m-0">{user?.name || 'User'}</h2>
                <div className="d-flex align-center gap-sm">
                  <span className="text-muted">{user?.email || 'user@example.com'}</span>
                  <span className="badge badge-primary">{user?.role || 'Customer'}</span>
                </div>
              </div>
            </div>
            <div className="d-flex align-center gap-sm">
              <Link to="/orders" className="btn secondary"><Icons.ShoppingCart size={18} /> Orders</Link>
              <Link to="/wishlist" className="btn secondary"><Icons.Heart size={18} /> Wishlist</Link>
              <button className="btn" onClick={toggle}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-secondary">
          <div className="grid grid-cols-3 gap-md">
            <div className="card p-4 text-center">
              <h3 className="display-4 text-primary m-0">{orders.length}</h3>
              <p className="text-muted">Total Orders</p>
            </div>
            <div className="card p-4 text-center">
              <h3 className="display-4 text-success m-0">2</h3>
              <p className="text-muted">Saved Addresses</p>
            </div>
            <div className="card p-4 text-center">
              <h3 className="display-4 text-accent m-0">4</h3>
              <p className="text-muted">Wishlist Items</p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-lg align-start wrap-md">
        {/* Sidebar */}
        <aside className="card p-0" style={{ minWidth: '250px' }}>
          <div className="p-4 text-center border-bottom">
            <div className="avatar-placeholder xl mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {user?.name?.[0] || 'U'}
            </div>
            <h3 className="m-0">{user?.name || 'User'}</h3>
            <p className="text-muted">{user?.email || 'user@example.com'}</p>
            <span className="badge badge-primary mt-2">{user?.role || 'Customer'}</span>
          </div>
          <nav className="p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`btn w-full justify-start ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ marginBottom: '0.5rem' }}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.label}
              </button>
            ))}
            <button className="btn w-full justify-start btn-ghost text-danger" onClick={logout}>
              <Icons.LogOut size={18} className="mr-2" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {activeTab === 'overview' && (
            <div className="d-grid gap-md">
              {isAdmin ? (
                <div className="grid grid-cols-3 gap-md">
                  <div className="card p-4 text-center">
                    <h3 className="display-4 text-primary m-0">12</h3>
                    <p className="text-muted">Total Users</p>
                  </div>
                  <div className="card p-4 text-center">
                    <h3 className="display-4 text-success m-0">45</h3>
                    <p className="text-muted">Products</p>
                  </div>
                  <div className="card p-4 text-center">
                    <h3 className="display-4 text-accent m-0">8</h3>
                    <p className="text-muted">Active Orders</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-md">
                  <div className="card p-4 text-center">
                    <h3 className="display-4 text-primary m-0">{orders.length}</h3>
                    <p className="text-muted">Total Orders</p>
                  </div>
                  <div className="card p-4 text-center">
                    <h3 className="display-4 text-success m-0">0</h3>
                    <p className="text-muted">Returns</p>
                  </div>
                  <div className="card p-4 text-center">
                    <h3 className="display-4 text-accent m-0">2</h3>
                    <p className="text-muted">Addresses</p>
                  </div>
                </div>
              )}

              <div className="card p-4">
                <h3 className="mb-4">Quick Links</h3>
                {isAdmin ? (
                  <div className="d-grid grid-4 gap-md">
                    <Link to="/reports" className="btn secondary"><Icons.BarChart2 size={18} /> Reports</Link>
                    <Link to="/users" className="btn secondary"><Icons.Users size={18} /> Users</Link>
                    <Link to="/products" className="btn secondary"><Icons.Package size={18} /> Products</Link>
                    <Link to="/orders" className="btn secondary"><Icons.ShoppingCart size={18} /> Orders</Link>
                    <Link to="/suppliers" className="btn secondary"><Icons.Truck size={18} /> Suppliers</Link>
                    <Link to="/inventory" className="btn secondary"><Icons.Package size={18} /> Inventory</Link>
                    <Link to="/deliveries" className="btn secondary"><Icons.Truck size={18} /> Deliveries</Link>
                    <Link to="/payments" className="btn secondary"><Icons.CreditCard size={18} /> Payments</Link>
                    <Link to="/notifications" className="btn secondary"><Icons.Bell size={18} /> Notifications</Link>
                  </div>
                ) : (
                  <div className="d-grid grid-4 gap-md">
                    <Link to="/orders" className="btn secondary"><Icons.ShoppingCart size={18} /> My Orders</Link>
                    <Link to="/wishlist" className="btn secondary"><Icons.Heart size={18} /> Wishlist</Link>
                    <Link to="/cart" className="btn secondary"><Icons.ShoppingCart size={18} /> Cart</Link>
                    <Link to="/catalog" className="btn secondary"><Icons.Search size={18} /> Browse Products</Link>
                  </div>
                )}
              </div>
              {!isAdmin && (
                <div className="card p-4">
                  <h3 className="mb-3">Recent Activity</h3>
                  <div className="d-grid gap-sm">
                    <div className="d-flex align-center justify-between">
                      <div className="d-flex align-center gap-sm">
                        <Icons.Heart size={16} className="text-muted" />
                        <span>Added an item to wishlist</span>
                      </div>
                      <small className="text-muted">2d ago</small>
                    </div>
                    <div className="d-flex align-center justify-between">
                      <div className="d-flex align-center gap-sm">
                        <Icons.CreditCard size={16} className="text-muted" />
                        <span>Paid for order #1002</span>
                      </div>
                      <small className="text-muted">1w ago</small>
                    </div>
                    <div className="d-flex align-center justify-between">
                      <div className="d-flex align-center gap-sm">
                        <Icons.Truck size={16} className="text-muted" />
                        <span>Order #1003 delivered</span>
                      </div>
                      <small className="text-muted">3w ago</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isAdmin && activeTab === 'orders' && (
            <div className="d-grid grid-3 gap-md">
              {orders.map(order => (
                <div key={order.id} className="card p-4">
                  <div className="d-flex justify-between align-center mb-2">
                    <h3 className="m-0">#{order.id}</h3>
                    <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>{order.status}</span>
                  </div>
                  <div className="text-muted mb-3">{order.date}</div>
                  <div className="d-flex align-center gap-sm mb-3">
                    <Icons.CreditCard size={16} className="text-muted" />
                    <span className="fw-bold">PKR{order.total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-between align-center">
                    <Link to="/orders" className="btn sm">View details</Link>
                    <button className="btn sm btn-outline">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAdmin && activeTab === 'manage' && (
            <div className="card p-4">
              <h2 className="mb-4">Admin Management</h2>
              <p className="text-muted mb-4">Quick access to key administration sections.</p>
              <div className="d-grid grid-4 gap-md">
                <Link to="/users" className="btn secondary"><Icons.Users size={18} /> Users</Link>
                <Link to="/products" className="btn secondary"><Icons.Package size={18} /> Products</Link>
                <Link to="/orders" className="btn secondary"><Icons.ShoppingCart size={18} /> Orders</Link>
                <Link to="/suppliers" className="btn secondary"><Icons.Truck size={18} /> Suppliers</Link>
                <Link to="/inventory" className="btn secondary"><Icons.Package size={18} /> Inventory</Link>
                <Link to="/deliveries" className="btn secondary"><Icons.Truck size={18} /> Deliveries</Link>
                <Link to="/payments" className="btn secondary"><Icons.CreditCard size={18} /> Payments</Link>
                <Link to="/reports" className="btn secondary"><Icons.BarChart2 size={18} /> Reports</Link>
                <Link to="/notifications" className="btn secondary"><Icons.Bell size={18} /> Notifications</Link>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-4">
              <h2 className="mb-4">Account Settings</h2>
              <form className="d-grid gap-md" style={{ maxWidth: '400px' }}>
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input w-full" defaultValue={user?.name} />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input w-full" defaultValue={user?.email} disabled />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" className="input w-full" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="d-flex gap-sm">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => toast.show('success', 'Profile updated')}
                  >
                    Save Changes
                  </button>
                  <button type="button" className="btn secondary" onClick={toggle}>
                    {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
