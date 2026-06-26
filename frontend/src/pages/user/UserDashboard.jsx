import { Link } from 'react-router-dom';
import { useAuth } from '../../App.jsx';

export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="panel p-6 lg:col-span-2">
        <h1 className="text-3xl font-bold text-medical-navy">Welcome, {user?.full_name}</h1>
        <p className="mt-2 text-slate-600">Manage profile details, order medicines, and monitor prescription verification in one place.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/shop">Browse Medicines</Link>
          <Link className="btn-secondary" to="/orders">View Orders</Link>
        </div>
      </div>
      <div className="panel p-6">
        <h2 className="font-bold text-slate-900">Profile</h2>
        {user?.profile_picture_url && <img src={user.profile_picture_url} className="mt-4 h-24 w-24 rounded-full object-cover" alt="Profile" />}
        <p className="mt-4 text-sm text-slate-600">{user?.email}</p>
        <p className="text-sm text-slate-600">{user?.phone}</p>
        <Link className="mt-4 btn-secondary" to="/profile">Edit Profile</Link>
      </div>
    </section>
  );
}
