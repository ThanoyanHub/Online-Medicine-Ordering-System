import { Eye, HeartPulse, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../App.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = new URLSearchParams();
      data.append('username', form.email);
      data.append('password', form.password);
      const response = await api.post('/auth/login', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      login(response.data.access_token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed.');
    }
  };

  return (
    <section className="mx-auto grid min-h-[720px] max-w-6xl overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-center bg-slate-50 px-6 py-10 sm:px-12">
        <div className="mb-10 flex items-center gap-3 text-medical-navy">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><HeartPulse className="h-6 w-6" /></span>
          <span className="text-xl font-bold">MediOrder</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Sign in</h1>
        <p className="mt-3 text-sm text-slate-500">Do not have an account? <Link className="font-bold text-emerald-700 underline decoration-emerald-200" to="/register">Create now</Link></p>
        <form onSubmit={submit} className="mt-9 grid gap-5">
          <label>
            <span className="text-sm font-bold text-slate-500">E-mail</span>
            <span className="relative mt-2 block">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input className="field pl-10" type="email" placeholder="example@gmail.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </span>
          </label>
          <label>
            <span className="text-sm font-bold text-slate-500">Password</span>
            <span className="relative mt-2 block">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input className="field pl-10 pr-10" type="password" placeholder="••••••••" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              <Eye className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </span>
          </label>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" className="rounded border-slate-300" /> Remember me</label>
            <a className="font-bold text-emerald-700" href="mailto:support@mediorder.local">Forgot Password?</a>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary bg-emerald-800 hover:bg-emerald-900">Sign in</button>
          <div className="flex items-center gap-3 text-xs font-bold uppercase text-slate-300"><span className="h-px flex-1 bg-slate-200" /> Secure access <span className="h-px flex-1 bg-slate-200" /></div>
          <div className="grid gap-3">
            <button type="button" className="btn-secondary justify-start"><span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 font-black text-blue-600">G</span> Continue with Google</button>
            <button type="button" className="btn-secondary justify-start"><span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 font-black text-white">f</span> Continue with Facebook</button>
          </div>
        </form>
      </div>
      <div className="relative hidden overflow-hidden bg-emerald-950 p-12 text-white lg:block">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-2xl" />
        <div className="relative z-10 flex justify-end text-sm font-bold text-emerald-100">Support</div>
        <div className="relative z-10 mx-auto mt-24 max-w-md rounded-lg bg-white p-8 text-slate-900 shadow-2xl">
          <p className="section-kicker">Verified care</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-emerald-950">Order medicines with prescription confidence</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">Upload prescriptions, get admin verification, and track every step from pending review to delivery.</p>
          <div className="mt-6 inline-flex rounded-full bg-emerald-800 px-5 py-2 text-sm font-bold text-white">Learn more</div>
        </div>
        <div className="relative z-20 ml-auto mr-8 -mt-8 w-56 rounded-lg bg-white p-5 text-slate-900 shadow-xl">
          <p className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified orders</p>
          <p className="mt-2 text-3xl font-black text-emerald-800">98.7%</p>
        </div>
        <div className="relative z-10 mt-14 text-center">
          <h3 className="text-3xl font-black">Introducing smarter pharmacy flows</h3>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-emerald-100">Customers get simple ordering while administrators get clean verification, inventory, and dispatch controls.</p>
        </div>
      </div>
    </section>
  );
}
