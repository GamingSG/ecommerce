// src/pages/ProductsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { Search, SlidersHorizontal, X, PackageX, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Jewelry', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category   = searchParams.get('category') || 'All';
  const search     = searchParams.get('search') || '';
  const sort       = searchParams.get('sort') || 'newest';
  const page       = parseInt(searchParams.get('page') || '1');
  const minPrice   = searchParams.get('minPrice') || '';
  const maxPrice   = searchParams.get('maxPrice') || '';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [localSearch, setLocalSearch] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await productAPI.getAll(params);
      setProducts(data.data);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, sort, category, search, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const applyPriceFilter = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (localMin) p.set('minPrice', localMin); else p.delete('minPrice');
    if (localMax) p.set('maxPrice', localMax); else p.delete('maxPrice');
    p.set('page', '1');
    setSearchParams(p);
    setFiltersOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalMin('');
    setLocalMax('');
    setLocalSearch('');
  };

  const hasActiveFilters = category !== 'All' || search || minPrice || maxPrice;

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">All Products</h1>
        {pagination.total > 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Showing {products.length} of {pagination.total} products
            {category !== 'All' && ` in ${category}`}
            {search && ` for "${search}"`}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar Filters ── */}
        <aside className={`lg:w-64 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="card p-5 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</p>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search..."
                  className="input text-sm py-2"
                />
                <button type="submit" className="btn-primary py-2 px-3">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      category === cat
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range (₹)</p>
              <form onSubmit={applyPriceFilter} className="space-y-2">
                <div className="flex gap-2">
                  <input value={localMin} onChange={(e) => setLocalMin(e.target.value)} placeholder="Min" type="number" className="input text-sm py-2" />
                  <input value={localMax} onChange={(e) => setLocalMax(e.target.value)} placeholder="Max" type="number" className="input text-sm py-2" />
                </div>
                <button type="submit" className="btn-primary w-full py-2 text-sm">Apply</button>
              </form>
            </div>
          </div>
        </aside>

        {/* ── Products Grid ── */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setFiltersOpen((p) => !p)} className="lg:hidden flex items-center gap-2 btn-outline text-sm py-2 px-4">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input py-2 text-sm w-auto pr-8"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filters chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {category !== 'All' && (
                <span className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs px-3 py-1.5 rounded-full font-medium">
                  {category}
                  <button onClick={() => updateParam('category', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs px-3 py-1.5 rounded-full font-medium">
                  "{search}"
                  <button onClick={() => { updateParam('search', ''); setLocalSearch(''); }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs px-3 py-1.5 rounded-full font-medium">
                  ₹{minPrice || '0'} – ₹{maxPrice || '∞'}
                  <button onClick={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); setLocalMin(''); setLocalMax(''); }}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title="No products found"
              description="Try adjusting your filters or search terms."
              action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination page={pagination.page} pages={pagination.pages} onChange={(p) => updateParam('page', String(p))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
