// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { useState } from 'react';
import StarRating from '../common/StarRating';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(
    user?.wishlist?.includes(product._id) || false
  );
  const [adding, setAdding] = useState(false);

  const image = product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image';
  const discountPct = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    setAdding(true);
    await addToCart(product._id, 1);
    setAdding(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to use wishlist'); return; }
    try {
      await userAPI.toggleWishlist(product._id);
      setWishlisted((p) => !p);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <Link to={`/products/${product._id}`} className="card-hover group block">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-square bg-gray-50 dark:bg-zinc-800">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && <span className="badge-purple text-xs">Featured</span>}
          {discountPct > 0 && <span className="badge-danger text-xs">-{discountPct}%</span>}
          {product.stock === 0 && <span className="badge bg-gray-200 text-gray-600 text-xs">Out of Stock</span>}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-zinc-900 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.title}
        </h3>

        <StarRating rating={product.ratings} showCount count={product.numReviews} />

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice > 0 && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-9 h-9 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
