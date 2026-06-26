import { Clock3, PackageCheck, Search, ShieldCheck, SlidersHorizontal, Truck, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../App.jsx';
import PrescriptionModal from '../../components/PrescriptionModal.jsx';

export default function Shop() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', maxPrice: '' });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/medicines').then((response) => setMedicines(response.data));
  }, []);

  const categories = useMemo(() => [...new Set(medicines.map((medicine) => medicine.category))], [medicines]);
  const featured = medicines.slice(0, 4);
  const visible = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || medicine.category === filters.category;
    const matchesPrice = !filters.maxPrice || medicine.price <= Number(filters.maxPrice);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section className="space-y-12">
      <div className="grid overflow-hidden rounded-lg border border-white/70 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <p className="section-kicker">Team 1 pharmacy system</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">Your trusted online medicine market</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Browse verified inventory, upload prescriptions at checkout, and follow every order from pending verification to doorstep delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="btn-primary">Shop Now</a>
            <a href="#about" className="btn-secondary">About MediOrder</a>
          </div>
        </div>
        <div className="relative min-h-[360px] bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-8">
          <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl" />
          <div className="absolute bottom-6 left-8 h-28 w-28 rounded-full bg-blue-200/70 blur-2xl" />
          <div className="relative mx-auto grid max-w-lg gap-4">
            <div className="ml-auto w-72 rotate-2 rounded-lg bg-white p-5 shadow-2xl shadow-slate-300/60">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Prescription</span>
                <UploadCloud className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">Upload and verify</h3>
              <p className="mt-2 text-sm text-slate-500">Secure image upload to AWS S3 before admin approval.</p>
            </div>
            <div className="w-80 -rotate-2 rounded-lg bg-medical-navy p-6 text-white shadow-2xl">
              <p className="text-sm text-blue-100">Order status</p>
              <div className="mt-5 grid gap-3">
                {['Pending Verification', 'Processing', 'Dispatched'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400 text-sm font-black text-emerald-950">{index + 1}</span>
                    <span className="text-sm font-bold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-20 w-64 rounded-lg bg-white p-5 shadow-xl">
              <p className="text-sm font-bold text-slate-500">Available medicines</p>
              <p className="mt-1 text-4xl font-black text-emerald-700">{medicines.length || '24'}+</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          [Clock3, 'Responsive', 'Quick prescription review workflow'],
          [ShieldCheck, 'Secure', 'JWT access and protected routes'],
          [Truck, 'Shipping', 'Dispatch and delivery status tracking'],
          [PackageCheck, 'Transparent', 'Admin verified inventory updates']
        ].map(([Icon, title, text]) => (
          <div key={title} className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm">
            <Icon className="mt-1 h-6 w-6 text-emerald-700" />
            <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <section id="about" className="grid gap-8 rounded-lg bg-medical-navy p-6 text-white shadow-xl shadow-slate-300/50 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">About us</p>
          <h2 className="mt-3 text-3xl font-black">Built for safer digital pharmacy ordering</h2>
          <p className="mt-4 leading-7 text-blue-50">
            MediOrder helps customers order prescription medicines while giving administrators a focused verification console. Every request starts as pending, includes an uploaded prescription, and can be approved, rejected, dispatched, or delivered with clear status history.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Verified', 'Prescription-first checkout'],
            ['Managed', 'Inventory and stock control'],
            ['Tracked', 'Order timeline visibility']
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-2xl font-black text-emerald-200">{title}</p>
              <p className="mt-2 text-sm text-blue-50">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Featured products</p>
            <h2 className="page-title mt-1">Medicine Shop</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input className="field pl-9" placeholder="Search products" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
            </label>
            <select className="field" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <label className="relative">
              <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input className="field pl-9" type="number" placeholder="Max price" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
            </label>
          </div>
        </div>
        {message && <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}
        {featured.length > 0 && (
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            {featured.map((medicine) => (
              <Link to={`/product/${medicine.id}`} key={medicine.id} className="panel block p-4 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="soft-band flex h-24 items-center justify-center overflow-hidden rounded text-3xl font-black text-blue-600">
                  {medicine.image_url ? <img src={medicine.image_url} alt={medicine.name} className="h-full w-full object-cover" /> : '+'}
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{medicine.category}</p>
                <h3 className="mt-1 line-clamp-1 font-bold text-slate-900">{medicine.name}</h3>
                <p className="mt-2 font-black text-medical-navy">{medicine.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((medicine) => (
            <Link to={`/product/${medicine.id}`} key={medicine.id} className="panel flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">
              <div className="soft-band mb-4 flex h-36 items-center justify-center overflow-hidden rounded-lg text-5xl font-bold text-blue-600 shadow-inner">
                {medicine.image_url ? <img src={medicine.image_url} alt={medicine.name} className="h-full w-full object-cover" /> : '+'}
              </div>
              <div className="flex-1">
                <p className="section-kicker">{medicine.category}</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{medicine.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{medicine.description}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xl font-bold text-medical-navy">{medicine.price.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{medicine.stock} in stock</p>
                </div>
                <button disabled={!user || medicine.stock === 0} onClick={(e) => { e.preventDefault(); setSelected(medicine); }} className="btn-primary">Buy</button>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {selected && <PrescriptionModal medicine={selected} onClose={() => setSelected(null)} onPlaced={() => setMessage('Order submitted for pending verification.')} />}
    </section>
  );
}
