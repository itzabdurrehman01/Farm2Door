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

      <div className="main-wrapper" style={{
        display: 'flex',
        minHeight: 'calc(100vh - 60px)'
      }}>
        {showSidebar && (
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`} style={{
            width: sidebarOpen ? '260px' : '0',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            borderRight: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)'
          }}>
            <Sidebar />
          </aside>
        )}

        <main className="content" style={{
          flex: 1,
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <Outlet />
        </main>
      </div>

      {!showSidebar && <Footer />}
    </div>
  );
}

export default Layout;
