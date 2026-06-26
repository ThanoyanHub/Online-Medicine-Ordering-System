import { useEffect, useState } from 'react';
import { api } from '../../App.jsx';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const load = () => {
    api.get('/admin/orders').then((response) => {
      setOrders(Array.isArray(response.data) ? response.data : []);
      setError('');
    }).catch(() => setError('Unable to load orders. Confirm backend, MySQL, and admin login are active.'));
  };
  useEffect(() => {
    load();
  }, []);

  const action = async (order, type, status) => {
    try {
      if (type === 'approve') await api.post(`/admin/orders/${order.id}/approve`);
      if (type === 'reject') await api.post(`/admin/orders/${order.id}/reject`, { reason: 'Invalid/Wrong Prescription' });
      if (type === 'status') await api.patch(`/admin/orders/${order.id}/status`, { status });
      load();
    } catch {
      setError('Order action failed. Check stock levels and admin permissions.');
    }
  };

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-medical-navy">Order Verification</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="panel p-5">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="font-bold">Order #{order.id} · {order.user?.full_name || 'Unknown User'}</h2>
                <p className="text-sm text-slate-500">{order.user?.email || 'N/A'} · ${(order.total_amount || 0).toFixed(2)}</p>
                <p className="mt-1 text-sm font-semibold text-blue-700">{order.status}</p>
              </div>
              {order.prescription?.image_url && <a className="btn-secondary" target="_blank" rel="noreferrer" href={order.prescription.image_url}>View Prescription</a>}
            </div>
            <ul className="mt-4 text-sm text-slate-600">{(order.items || []).map((item) => <li key={item.id}>{item.quantity} x {item.medicine?.name || 'Deleted Medicine'}</li>)}</ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {order.status === 'Pending Verification' && (
                <>
                  <button className="btn-primary" onClick={() => action(order, 'approve')}>Approve</button>
                  <button className="btn-secondary" onClick={() => action(order, 'reject')}>Reject</button>
                </>
              )}
              {['Approved', 'Processing'].includes(order.status) && <button className="btn-secondary" onClick={() => action(order, 'status', 'Dispatched')}>Mark Dispatched</button>}
              {order.status === 'Dispatched' && <button className="btn-primary" onClick={() => action(order, 'status', 'Delivered')}>Mark Delivered</button>}
            </div>
          </article>
        ))}
        {orders.length === 0 && (
          <div className="panel p-10 text-center">
            <p className="text-xl font-black text-slate-900">No orders awaiting review</p>
            <p className="mt-2 text-sm text-slate-500">Customer orders will appear here after prescription upload and checkout.</p>
          </div>
        )}
      </div>
    </section>
  );
}
