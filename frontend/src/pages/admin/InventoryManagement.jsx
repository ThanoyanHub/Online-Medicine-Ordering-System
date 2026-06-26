import { useEffect, useState } from 'react';
import { api } from '../../App.jsx';

const empty = { name: '', category: '', description: '', price: '', stock: '', manufacturer: '', requires_prescription: true, image_url: '' };

export default function InventoryManagement() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const load = () => {
    api.get('/medicines').then((response) => {
      setMedicines(response.data);
      setError('');
    }).catch(() => setError('Unable to load medicines. Check your backend connection and admin token.'));
  };
  useEffect(load, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) await api.put(`/medicines/${editingId}`, payload);
      else await api.post('/medicines', payload);
      setForm(empty);
      setEditingId(null);
      load();
    } catch {
      setError('Medicine could not be saved. Confirm you are logged in as admin.');
    }
  };

  const edit = (medicine) => {
    setEditingId(medicine.id);
    setForm({ ...medicine, price: String(medicine.price), stock: String(medicine.stock) });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/medicines/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image_url: response.data.image_url }));
      setError('');
    } catch {
      setError('Failed to upload image. Make sure it is a valid format (JPG, PNG, WEBP) under 5MB.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="panel p-5">
        <h1 className="text-xl font-bold text-medical-navy">{editingId ? 'Edit Medicine' : 'Add Medicine'}</h1>
        <div className="mt-4 grid gap-3">
          {['name', 'category', 'manufacturer'].map((key) => <input key={key} className="field" placeholder={key.replace('_', ' ')} value={form[key] || ''} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />)}
          
          <div className="flex gap-4 items-center">
            {form.image_url && <img src={form.image_url} alt="Preview" className="h-16 w-16 object-cover rounded-md border" />}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} className="field p-0 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-medical-blue file:text-white hover:file:bg-medical-navy" disabled={uploadingImage} />
            </div>
          </div>
          <textarea className="field min-h-24" placeholder="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <input className="field" type="number" step="0.01" placeholder="price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          <input className="field" type="number" placeholder="stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.requires_prescription} onChange={(event) => setForm({ ...form, requires_prescription: event.target.checked })} /> Requires prescription</label>
          <button className="btn-primary" disabled={uploadingImage}>{editingId ? 'Update' : 'Create'}</button>
        </div>
      </form>
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-xl font-black text-medical-navy">Current Inventory</h2>
          {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Medicine</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3"></th></tr></thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{medicine.name}<p className="text-xs text-slate-500">{medicine.category}</p></td>
                <td className="p-3">Rs.{medicine.price.toFixed(2)}</td>
                <td className="p-3">{medicine.stock}</td>
                <td className="p-3 text-right"><button className="btn-secondary" onClick={() => edit(medicine)}>Edit</button></td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-slate-500">No medicines found yet. Add your first medicine using the form.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
