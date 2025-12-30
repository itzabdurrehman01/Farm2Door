import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? saved === '1' : true;
  });
  const location = useLocation();
  const auth = useAuth();

  // Logic to determine if sidebar should be shown
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isLoggedIn = !!auth?.user;
  const showSidebar = isLoggedIn && !isAuthPage;
  useEffect(() => {
    localStorage.setItem('sidebarOpen', sidebarOpen ? '1' : '0');
  }, [sidebarOpen]);

  return (
    <div className="app-layout">
      <NavBar onToggle={() => setSidebarOpen(v => !v)} />

      <div className="main-wrapper">
        {showSidebar && (
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <Sidebar />
          </aside>
        )}

        <main className="content">
          <div className="content-inner">
            <Outlet />
          </div>
        </main>
      </div>

      {!showSidebar && <Footer />}
    </div>
  );
}

export default Layout;
