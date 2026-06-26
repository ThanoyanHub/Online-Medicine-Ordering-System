import { HeartPulse, MapPin, Phone, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../App.jsx';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
    <section className="mx-auto grid min-h-[760px] max-w-6xl overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-medical-navy p-12 text-white lg:block">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="absolute bottom-10 right-8 h-64 w-64 rounded-full bg-emerald-400/20 blur-2xl" />
        <div className="relative z-10 flex items-center gap-3 text-xl font-bold"><HeartPulse className="h-7 w-7 text-emerald-300" /> MediOrder</div>
        <div className="relative z-10 mt-24 max-w-lg">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">Join verified care</p>
          <h1 className="mt-3 text-5xl font-black leading-tight">Create your health ordering profile</h1>
          <p className="mt-5 leading-7 text-blue-50">Save your delivery details, upload prescriptions securely, and see each order move through verification, dispatch, and delivery.</p>
        </div>
        <div className="relative z-10 mt-12 grid max-w-lg gap-4 sm:grid-cols-2">
          {['S3 image uploads', 'JWT protected routes', 'Admin verification', 'Live order timeline'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/10 p-4 text-sm font-bold backdrop-blur">{item}</div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center bg-slate-50 px-6 py-10 sm:px-12">
        <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          <Sparkles className="h-4 w-4" /> Fast onboarding
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Create account</h1>
        <p className="mt-3 text-sm text-slate-500">Already registered? <Link className="font-bold text-emerald-700 underline decoration-emerald-200" to="/login">Sign in</Link></p>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input className="field" placeholder="Full name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
          <input className="field" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <label className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="field pl-10" placeholder="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
          <label className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea className="field min-h-24 pl-10" placeholder="Delivery address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          </label>
          <input className="field" type="password" placeholder="Password, minimum 8 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary bg-emerald-800 hover:bg-emerald-900"><UserPlus className="h-4 w-4" /> Create Account</button>
        </form>
      </div>
    </section>
  );
}
