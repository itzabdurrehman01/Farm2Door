import './App.css';
import './styles/design_system.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './state/CartContext';
import { AuthProvider } from './state/AuthContext';
import { WishlistProvider } from './state/WishlistContext';
import { ThemeProvider } from './state/ThemeContext';
import { ToastProvider } from './state/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import About from './pages/About';
import Producers from './pages/Producers';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import SuppliersPage from './pages/SuppliersPage';
import InventoryPage from './pages/InventoryPage';
import DeliveriesPage from './pages/DeliveriesPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireRole from './components/RequireRole';
import RequireAuth from './components/RequireAuth';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
      <WishlistProvider>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
            <Route path="/catalog" element={<RequireAuth><Catalog /></RequireAuth>} />
            <Route path="/about" element={<About />} />
            <Route path="/producers" element={<Producers />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<RequireRole role="customer"><Cart /></RequireRole>} />
            <Route path="/checkout" element={<RequireRole role="customer"><Checkout /></RequireRole>} />
            <Route path="/users" element={<RequireRole role="admin"><UsersPage /></RequireRole>} />
            <Route path="/products" element={<RequireRole role="admin"><ProductsPage /></RequireRole>} />
            <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
            <Route path="/suppliers" element={<RequireRole role="admin"><SuppliersPage /></RequireRole>} />
            <Route path="/inventory" element={<RequireRole role="admin"><InventoryPage /></RequireRole>} />
            <Route path="/deliveries" element={<RequireRole role="admin"><DeliveriesPage /></RequireRole>} />
            <Route path="/payments" element={<RequireRole role="admin"><PaymentsPage /></RequireRole>} />
            <Route path="/reports" element={<RequireRole role="admin"><ReportsPage /></RequireRole>} />
            <Route path="/notifications" element={<RequireRole role="admin"><NotificationsPage /></RequireRole>} />
            <Route path="/admin/*" element={<RequireRole role="admin"><ReportsPage /></RequireRole>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>
        </Routes>
      </CartProvider>
      </WishlistProvider>
      </AuthProvider>
      </ToastProvider>
      </ThemeProvider>
      </BrowserRouter>
  );
}

export default App;
