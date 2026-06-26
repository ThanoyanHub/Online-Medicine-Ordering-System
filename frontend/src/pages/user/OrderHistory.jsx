import { useEffect, useState } from 'react';
import { api } from '../../App.jsx';

const steps = ['Pending Verification', 'Processing', 'Dispatched', 'Delivered'];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const load = () => {
    api.get('/orders').then((response) => setOrders(response.data));
  };
  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    await api.post(`/orders/${id}/cancel`);
    load();
  };

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-medical-navy">Order History</h1>
      <div className="grid gap-4">
        {orders.map((order) => {
          const activeIndex = steps.indexOf(order.status);
          return (
            <article key={order.id} className="panel p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">Order #{order.id}</h2>
                  <p className="text-sm text-slate-500">${order.total_amount.toFixed(2)} · {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{order.status}</span>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {steps.map((step, index) => (
                  <div key={step} className={`rounded-lg border px-3 py-2 text-sm ${index <= activeIndex ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400'}`}>{step}</div>
                ))}
              </div>
              {order.status === 'Rejected' && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{order.rejection_reason}</p>}
              <ul className="mt-4 text-sm text-slate-600">
                {order.items.map((item) => <li key={item.id}>{item.quantity} x {item.medicine.name}</li>)}
              </ul>
              {!['Dispatched', 'Delivered', 'Cancelled'].includes(order.status) && (
                <button onClick={() => cancel(order.id)} className="mt-4 btn-secondary">Cancel Order</button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
