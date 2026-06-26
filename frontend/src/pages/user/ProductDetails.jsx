import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { api, useAuth } from '../../App.jsx';
import PrescriptionModal from '../../components/PrescriptionModal.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/medicines/${id}`)
      .then((response) => {
        setMedicine(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Product not found.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading product...</div>;
  if (error || !medicine) return <div className="py-20 text-center text-red-600">{error}</div>;

  return (
    <section className="space-y-8">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/shop" className="hover:text-slate-900 hover:underline">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="cursor-default">{medicine.category}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">{medicine.name}</span>
      </nav>

      {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] xl:gap-16">
        {/* Left: Image */}
        <div className="flex h-[400px] items-center justify-center rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 sm:h-[500px]">
          {medicine.image_url ? (
            <img src={medicine.image_url} alt={medicine.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-8xl font-black text-blue-100">+</div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col py-4">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <h1 className="text-4xl font-black text-slate-900 md:text-5xl">{medicine.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span className="text-sm text-slate-500">Verified Product</span>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-medical-navy">Rs.{medicine.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-8 space-y-4 text-sm leading-relaxed text-slate-600">
            <p>{medicine.description}</p>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
              <div>
                <span className="block font-bold text-slate-900">Category</span>
                {medicine.category}
              </div>
              <div>
                <span className="block font-bold text-slate-900">Manufacturer</span>
                {medicine.manufacturer || 'Unknown'}
              </div>
              <div>
                <span className="block font-bold text-slate-900">Stock Status</span>
                <span className={medicine.stock > 0 ? "text-emerald-600" : "text-red-600"}>
                  {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div>
                <span className="block font-bold text-slate-900">Prescription Required</span>
                {medicine.requires_prescription ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              disabled={!user || medicine.stock === 0}
              onClick={() => setShowModal(true)}
              className="w-full rounded-full bg-orange-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-orange-700 disabled:opacity-50 sm:w-auto"
            >
              {!user ? 'Login to order' : medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <PrescriptionModal
          medicine={medicine}
          onClose={() => setShowModal(false)}
          onPlaced={() => setMessage('Order submitted for pending verification.')}
        />
      )}
    </section>
  );
}
