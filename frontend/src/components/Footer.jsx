import { Activity, Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="grid w-full gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/shop" className="flex items-center gap-3 text-lg font-bold text-medical-navy">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
              <Activity className="h-6 w-6" />
            </span>
            MediOrder
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            A secure online medicine ordering system for verified prescriptions, reliable inventory, and transparent delivery tracking.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Twitter, Instagram].map((Icon, index) => (
              <span key={index} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600">
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Explore</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <Link to="/shop">Medicine Shop</Link>
            <Link to="/orders">Order Tracking</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Trust</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Prescription verification</p>
            <p>Encrypted authentication</p>
            <p>Admin-reviewed orders</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +94 11 234 5678</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@mediorder.local</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        © 2026 Team 1 Online Medicine Ordering System. Built for verified care workflows.
      </div>
    </footer>
  );
}
