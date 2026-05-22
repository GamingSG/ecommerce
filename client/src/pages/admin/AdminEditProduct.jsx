// src/pages/admin/AdminEditProduct.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { LoadingScreen } from '../../components/common/Spinner';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Jewelry', 'Other'];

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    productAPI.getById(id).then(({ data }) => {
      const p = data.data;
      setForm({
        title: p.title || '', description: p.description || '', brand: p.brand || '',
        category: p.category || '', price: p.price || '', discountPrice: p.discountPrice || '',
        stock: p.stock || '', tags: p.tags?.join(', ') || '', isFeatured: p.isFeatured || false,
      });
      setPreviews(p.images?.map((img) => img.url) || []);
    }).finally(() => setFetching(false));
  }, [id]);

  if (fetching) return <LoadingScreen />;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    imageFiles.forEach((f) => fd.append('images', f));
    setLoading(true);
    try {
      await productAPI.update(id, fd);
      toast.success('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Product Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Title</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} required className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows={4} className="input resize-none" />
            </div>
            <div><label className="label">Brand</label><input value={form.brand} onChange={(e) => set('brand', e.target.value)} required className="input" /></div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} required className="input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Price (₹)</label><input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required min={0} className="input" /></div>
            <div><label className="label">Discount Price (₹)</label><input type="number" value={form.discountPrice} onChange={(e) => set('discountPrice', e.target.value)} min={0} className="input" /></div>
            <div><label className="label">Stock</label><input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} required min={0} className="input" /></div>
            <div><label className="label">Tags (comma-separated)</label><input value={form.tags} onChange={(e) => set('tags', e.target.value)} className="input" /></div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-primary-600" />
              <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Featured Product</label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Images</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="w-24 h-24 rounded-xl object-cover bg-gray-100" />
            ))}
          </div>
          <label className="flex items-center gap-3 cursor-pointer btn-outline w-fit py-2 text-sm">
            <ImagePlus className="w-4 h-4" /> Replace Images
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="flex gap-4">
          <Link to="/admin/products" className="btn-ghost flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
