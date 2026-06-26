import { useEffect, useState } from 'react';
import { api } from '../../App.jsx';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/users')
      .then((response) => {
        setUsers(response.data);
        setError('');
      })
      .catch(() => setError('Unable to load users. Confirm backend and admin login are active.'));
  }, []);
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-100 p-5">
        <h1 className="text-2xl font-bold text-medical-navy">Users</h1>
        {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-100">
              <td className="p-3 font-medium">{user.full_name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan="4" className="p-8 text-center text-slate-500">No users found yet.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
