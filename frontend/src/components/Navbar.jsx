import { Activity, ClipboardList, LogOut, PackageSearch, ShieldCheck, ShoppingBag, UserCircle, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App.jsx';

const linkClass = ({ isActive }) => `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur-xl">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/shop" className="flex items-center gap-3 text-lg font-bold text-medical-navy">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-sm shadow-blue-200">
            <Activity className="h-6 w-6" />
          </span>
          <span>MediOrder</span>
        </NavLink>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink className={linkClass} to="/shop"><ShoppingBag className="h-4 w-4" /> Shop</NavLink>
          {user?.role === 'admin' ? (
            <>
              <NavLink className={linkClass} to="/admin"><ShieldCheck className="h-4 w-4" /> Admin</NavLink>
              <NavLink className={linkClass} to="/admin/inventory"><PackageSearch className="h-4 w-4" /> Inventory</NavLink>
              <NavLink className={linkClass} to="/admin/orders"><ClipboardList className="h-4 w-4" /> Orders</NavLink>
              <NavLink className={linkClass} to="/admin/users"><Users className="h-4 w-4" /> Users</NavLink>
            </>
          ) : user ? (
            <>
              <NavLink className={linkClass} to="/dashboard"><UserCircle className="h-4 w-4" /> Dashboard</NavLink>
              <NavLink className={linkClass} to="/orders"><ClipboardList className="h-4 w-4" /> Orders</NavLink>
            </>
          ) : null}
          {user ? (
            <button onClick={logout} className="btn-secondary"><LogOut className="h-4 w-4" /> Logout</button>
          ) : (
            <NavLink className={linkClass} to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
