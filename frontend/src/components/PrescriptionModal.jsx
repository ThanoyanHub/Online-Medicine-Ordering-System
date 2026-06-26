import { UploadCloud, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../App.jsx';

export default function PrescriptionModal({ medicine, onClose, onPlaced }) {
  const [file, setFile] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Upload a prescription image before checkout.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const upload = await api.post('/orders/upload-prescription', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await api.post('/orders', {
        items: [{ medicine_id: medicine.id, quantity: Number(quantity) }],
        shipping_address: address,
        prescription_url: upload.data.url
      });
      onPlaced();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Order could not be placed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={submit} className="panel w-full max-w-lg p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upload Prescription</h2>
            <p className="text-sm text-slate-500">{medicine.name} requires verification before dispatch.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="text-sm font-medium">Quantity</span>
            <input className="field mt-1" type="number" min="1" max={medicine.stock} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Shipping address</span>
            <textarea className="field mt-1 min-h-24" required value={address} onChange={(event) => setAddress(event.target.value)} />
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-8 text-center">
            <UploadCloud className="mb-2 h-8 w-8 text-blue-600" />
            <span className="font-semibold text-blue-800">{file ? file.name : 'Drop or choose prescription image'}</span>
            <input className="hidden" type="file" accept="image/*" onChange={(event) => setFile(event.target.files[0])} />
          </label>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="btn-primary">{loading ? 'Placing order...' : 'Place order for verification'}</button>
        </div>
      </form>
    </div>
  );
}
