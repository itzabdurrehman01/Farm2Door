import { useEffect, useState } from 'react';
import { apiGet } from '../api';
import { Icons } from '../components/Icons';
import { Link } from 'react-router-dom';

function StatCard({ title, value, icon, color }) {
  return (
    <div className="card p-4 d-flex align-center justify-between hover-lift">
      <div>
        <div className="text-muted text-sm uppercase mb-1">{title}</div>
        <div className="h2 m-0">{value}</div>
      </div>
      <div className="p-3 rounded-circle text-white" style={{ background: color }}>
        {icon}
      </div>
    </div>
  );
}

function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/reports/summary')
      .then(s => { setSummary(s); setLoading(false); })
      .catch(() => {
        // Fallback for demo
        setSummary({ users: 12, products: 45, orders: 8, payments: 1540 });
        setLoading(false);
      });
  }, []);

  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-5">
        <div>
          <h2 className="section-title m-0">Admin Dashboard</h2>
          <p className="text-muted">Overview of store performance and activity.</p>
        </div>
        <div className="d-flex gap-sm">
          <Link to="/products/new" className="btn secondary"><Icons.Plus size={16} /> New Product</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner"></div> Loading dashboard...</div>
      ) : summary ? (
        <div className="d-grid grid-4 gap-md mb-5">
          <StatCard title="Total Users" value={summary.users} icon={<Icons.Users size={24} />} color="var(--primary)" />
          <StatCard title="Products" value={summary.products} icon={<Icons.Package size={24} />} color="#F59E0B" />
          <StatCard title="Active Orders" value={summary.orders} icon={<Icons.ShoppingCart size={24} />} color="#3B82F6" />
          <StatCard title="Revenue" value={`$${summary.payments || '0'}`} icon={<Icons.CreditCard size={24} />} color="#10B981" />
        </div>
      ) : (
        <div className="card p-5 text-center text-muted">Failed to load data.</div>
      )}

      <div className="d-grid grid-2 gap-lg">
        <div className="card p-4">
          <h3 className="mb-3">Quick Actions</h3>
          <div className="d-grid gap-sm">
            <Link to="/users" className="btn secondary text-left d-flex align-center gap-sm">
              <Icons.Users size={16} /> Manage Users
            </Link>
            <Link to="/orders" className="btn secondary text-left d-flex align-center gap-sm">
              <Icons.ShoppingCart size={16} /> Manage All Orders
            </Link>
            <Link to="/catalog" className="btn secondary text-left d-flex align-center gap-sm">
              <Icons.Package size={16} /> View Product Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
