import './App.css';
import './styles/design_system.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './state/CartContext';
import { AuthProvider } from './state/AuthContext';
import { ThemeProvider } from './state/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            <Route path="/orders" element={<RequireRole role="admin"><OrdersPage /></RequireRole>} />
            <Route path="/suppliers" element={<RequireRole role="admin"><SuppliersPage /></RequireRole>} />
            <Route path="/inventory" element={<RequireRole role="admin"><InventoryPage /></RequireRole>} />
            <Route path="/deliveries" element={<RequireRole role="admin"><DeliveriesPage /></RequireRole>} />
            <Route path="/payments" element={<RequireRole role="admin"><PaymentsPage /></RequireRole>} />
            <Route path="/reports" element={<RequireRole role="admin"><ReportsPage /></RequireRole>} />
            <Route path="/notifications" element={<RequireRole role="admin"><NotificationsPage /></RequireRole>} />
            <Route path="/admin/*" element={<RequireRole role="admin"><ReportsPage /></RequireRole>} />
          </Route>
        </Routes>
      </CartProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
