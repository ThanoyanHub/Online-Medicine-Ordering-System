import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import InventoryManagement from './pages/admin/InventoryManagement.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import Shop from './pages/user/Shop.jsx';
import ProductDetails from './pages/user/ProductDetails.jsx';
import Profile from './pages/user/Profile.jsx';
import OrderHistory from './pages/user/OrderHistory.jsx';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const api = axios.create({ baseURL: API_BASE });
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    setUser: (nextUser) => {
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
    },
    login: (accessToken, nextUser) => {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(nextUser));
      setToken(accessToken);
      setUser(nextUser);
      navigate(nextUser.role === 'admin' ? '/admin' : '/dashboard');
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      navigate('/login');
    }
  }), [token, user, navigate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/shop" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderHistory />} />
            </Route>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/inventory" element={<InventoryManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
