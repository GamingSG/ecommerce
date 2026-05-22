// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const { data } = await productAPI.getAll(params);
      setProducts(data.data);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productAPI.delete(deleteModal.id);
      toast.success('Product deleted');
      setDeleteModal({ open: false, id: null });
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pagination.total} products total</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input pl-10" />
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {loading ? (
                Array(10).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-3 px-4"><div className="h-10 skeleton rounded" /></td></tr>
                ))
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="badge badge-info">{p.category}</span></td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">₹{p.price?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200">{p.ratings?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/products/edit/${p._id}`} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: p._id, title: p.title })}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      <Pagination page={pagination.page || page} pages={pagination.pages} onChange={setPage} />

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
