// src/pages/user/WishlistPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getProfile().then(({ data }) => {
      setProducts(data.data.wishlist || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-8">My Wishlist</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-64 skeleton rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save items you love and come back later."
          action={<Link to="/products" className="btn-primary">Explore Products</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </div>
  );
}
