import { BadgeCheck, CalendarDays, Camera, CreditCard, Mail, MapPin, Phone, Printer, ShieldCheck, UploadCloud, UserRound } from 'lucide-react';
import { useState } from 'react';
import { api, useAuth } from '../../App.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ full_name: user.full_name, phone: user.phone || '', address: user.address || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const save = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await api.put('/users/me', form);
      setUser(response.data);
      setMessage('Profile updated.');
    } catch {
      setError('Profile could not be updated. Please check the backend connection.');
    }
  };

  const upload = async (file) => {
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/users/upload-profile-pic', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const nextUser = { ...user, profile_picture_url: response.data.url };
      setUser(nextUser);
      setMessage('Profile picture uploaded.');
    } catch {
      setError('Image upload failed. Check S3 configuration and backend logs.');
    }
  };

  const joined = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today';

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6 rounded-lg bg-medical-navy p-6 text-white shadow-xl shadow-slate-300/50">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">Customer profile</p>
        <h1 className="mt-2 text-4xl font-black">Account and delivery details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="panel overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-700 to-medical-navy p-6 text-white">
            <div className="flex justify-end">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{user.role}</span>
            </div>
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="relative">
                {user.profile_picture_url ? (
                  <img src={user.profile_picture_url} className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-xl" alt="Profile" />
                ) : (
                  <div className="grid h-36 w-36 place-items-center rounded-full border-4 border-white bg-white/15 shadow-xl">
                    <UserRound className="h-16 w-16" />
                  </div>
                )}
                <label className="absolute bottom-2 right-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white text-emerald-700 shadow-lg">
                  <Camera className="h-5 w-5" />
                  <input className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files[0] && upload(event.target.files[0])} />
                </label>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-emerald-100">Category: verified customer</p>
              <h2 className="mt-1 text-2xl font-black">{user.full_name}</h2>
              <p className="mt-1 text-sm text-blue-100">UID: MED-{String(user.id).padStart(5, '0')}</p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">
                <BadgeCheck className="h-4 w-4" /> Verified
              </span>
            </div>
          </div>
          <div className="grid gap-4 p-6 text-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2 text-slate-500"><CalendarDays className="h-4 w-4" /> Date Joined</span>
              <span className="font-bold text-slate-900">{joined}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2 text-slate-500"><ShieldCheck className="h-4 w-4" /> Status</span>
              <span className="font-bold text-emerald-700">{user.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2 text-slate-500"><Phone className="h-4 w-4" /> Phone</span>
              <span className="font-bold text-slate-900">{user.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500"><Mail className="h-4 w-4" /> Email</span>
              <span className="font-bold text-slate-900">{user.email}</span>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-800 to-medical-navy p-5 text-white">
              <div>
                <p className="text-sm text-emerald-100">Delivery Account</p>
                <p className="mt-1 text-2xl font-black">{user.phone || '+94 000 000 000'}</p>
                <p className="text-xs text-emerald-100">MediOrder verified customer profile</p>
              </div>
              <button className="rounded-lg border border-white/20 px-4 py-2 text-sm font-bold">Edit</button>
            </div>
            <form onSubmit={save} className="grid gap-5 p-6">
              <label>
                <span className="text-sm font-bold text-slate-500">Full name</span>
                <input className="field mt-2" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-500">Phone number</span>
                <input className="field mt-2" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-500">Address</span>
                <textarea className="field mt-2 min-h-28" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50 p-5 text-center font-bold text-emerald-800">
                  <UploadCloud className="h-5 w-5" />
                  Upload profile picture
                  <input className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files[0] && upload(event.target.files[0])} />
                </label>
                <button type="submit" className="btn-primary bg-emerald-800 hover:bg-emerald-900">Save Profile</button>
              </div>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-500"><MapPin className="h-4 w-4" /> Primary delivery address</p>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-700">{user.address || form.address || 'No address saved yet.'}</p>
            </div>
            <div className="panel p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-500"><CreditCard className="h-4 w-4" /> E-ID Card</p>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><CreditCard className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs text-slate-500">UID</p>
                    <p className="font-black text-slate-900">MED-{String(user.id).padStart(5, '0')}</p>
                  </div>
                </div>
                <button className="btn-secondary"><Printer className="h-4 w-4" /> Print</button>
              </div>
            </div>
          </div>

          {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p>}
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
