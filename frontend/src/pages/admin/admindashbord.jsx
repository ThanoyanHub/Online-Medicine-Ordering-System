import { ArrowRight, ClipboardCheck, Package, PackageSearch, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../App.jsx';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/metrics')
      .then((response) => setMetrics(response.data))
      .catch(() => setError('Unable to load dashboard metrics. Check that FastAPI and MySQL are running.'));
  }, []);
  const cards = [
    ['Total orders', metrics?.total_orders ?? 0, ClipboardCheck],
    ['Pending verifications', metrics?.pending_verifications ?? 0, Package],
    ['Total users', metrics?.total_users ?? 0, Users]
  ];
  const actions = [
    ['Inventory Management', 'Add medicines, edit pricing, update stock levels, and manage product details.', '/admin/inventory', PackageSearch, 'from-blue-600 to-cyan-500'],
    ['Order Verification', 'Review prescriptions, approve valid requests, reject invalid files, and update delivery status.', '/admin/orders', ShieldCheck, 'from-emerald-600 to-teal-500'],
    ['User Management', 'View registered customers, account roles, and profile activity details.', '/admin/users', Users, 'from-slate-700 to-slate-900']
  ];
  return (
    <section className="space-y-8">
      <div className="rounded-lg bg-medical-navy p-6 text-white shadow-xl shadow-slate-300/50">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">Administrator console</p>
        <h1 className="mt-2 text-4xl font-black">Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl text-blue-50">Choose a management area below to control inventory, verify prescriptions, and monitor users.</p>
      </div>
      {error && <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="stat-panel">
            <Icon className="h-8 w-8 text-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {actions.map(([title, text, to, Icon, gradient]) => (
          <Link key={title} to={to} className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl">
            <div className={`bg-gradient-to-br ${gradient} p-5 text-white`}>
              <Icon className="h-9 w-9" />
              <h2 className="mt-8 text-2xl font-black">{title}</h2>
            </div>
            <div className="p-5">
              <p className="min-h-16 text-sm leading-6 text-slate-600">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Open section <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
