// src/pages/admin/AdminAddProduct.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Jewelry', 'Other'];

function ProductForm({ initial, onSubmit, loading, title }) {
  const [form, setForm] = useState(initial);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState(initial.imagePreviews || []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v); });
    imageFiles.forEach((f) => fd.append('images', f));
    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Product Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. Premium Wireless Headphones" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows={4} placeholder="Describe the product..." className="input resize-none" />
          </div>
          <div>
            <label className="label">Brand *</label>
            <input value={form.brand} onChange={(e) => set('brand', e.target.value)} required placeholder="e.g. Sony" className="input" />
          </div>
          <div>
            <label className="label">Category *</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} required className="input">
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required min={0} placeholder="999" className="input" />
          </div>
          <div>
            <label className="label">Discount Price (₹)</label>
            <input type="number" value={form.discountPrice} onChange={(e) => set('discountPrice', e.target.value)} min={0} placeholder="799 (optional)" className="input" />
          </div>
          <div>
            <label className="label">Stock Quantity *</label>
            <input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} required min={0} placeholder="100" className="input" />
          </div>
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="audio, wireless, bluetooth" className="input" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-primary-600" />
            <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Mark as Featured Product</label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Product Images</h2>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-8 cursor-pointer hover:border-primary-400 transition-colors mb-4">
          <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload images</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each (max 5)</p>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </label>
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="" className="w-24 h-24 rounded-xl object-cover" />
                {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded-md">Main</span>}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <label className="label">Or paste image URL</label>
          <input value={form.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://example.com/image.jpg" className="input" />
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/admin/products" className="btn-ghost flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Cancel</Link>
        <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
          {loading ? 'Saving...' : title}
        </button>
      </div>
    </form>
  );
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initial = { title: '', description: '', brand: '', category: '', price: '', discountPrice: '', stock: '', tags: '', isFeatured: false };

  const handleSubmit = async (fd) => {
    // If image URL provided, use it
    if (fd.get('imageUrl')) {
      fd.append('images', fd.get('imageUrl'));
      fd.delete('imageUrl');
    }
    setLoading(true);
    try {
      await productAPI.create(fd);
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to list a new product</p>
      </div>
      <ProductForm initial={initial} onSubmit={handleSubmit} loading={loading} title="Create Product" />
    </div>
  );
}
