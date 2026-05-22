// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import { LoadingScreen } from '../components/common/Spinner';
import {
  ShoppingCart, Heart, Share2, ArrowLeft, Truck, ShieldCheck,
  RefreshCw, Star, Package, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userAPI } from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.data);
        setWishlisted(user?.wishlist?.includes(id) || false);
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!product) return (
    <div className="container-page py-20 text-center">
      <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold mb-2">Product Not Found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-flex">Back to Products</Link>
    </div>
  );

  const image = (i) => product.images?.[i]?.url || 'https://placehold.co/500x500?text=No+Image';
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPct = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await userAPI.toggleWishlist(product._id);
      setWishlisted((p) => !p);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, reviewForm);
      toast.success('Review submitted!');
      const { data } = await productAPI.getById(id);
      setProduct(data.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* ── Images ── */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800 mb-4">
            <img
              src={image(activeImage)}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 badge-danger text-sm px-3 py-1">-{discountPct}%</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-primary-500' : 'border-gray-200 dark:border-zinc-700'
                  }`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{product.brand}</p>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <StarRating rating={product.ratings} size="md" showCount count={product.numReviews} />
            <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{effectivePrice.toLocaleString()}</span>
            {product.discountPrice > 0 && (
              <span className="text-xl text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          )}

          {/* Quantity + Actions */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">−</button>
                <span className="px-5 py-3 font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">+</button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 shadow-lg shadow-primary-500/20"
            >
              {adding ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={handleWishlist} className={`p-3 rounded-xl border-2 transition-colors ${wishlisted ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-gray-200 dark:border-zinc-700 text-gray-400 hover:border-red-300'}`}>
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[[Truck, 'Free Shipping'], [ShieldCheck, 'Secure Pay'], [RefreshCw, 'Easy Returns']].map(([Icon, text]) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="border-t border-gray-100 dark:border-zinc-800 pt-12">
        <h2 className="section-title mb-8">Customer Reviews</h2>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Summary */}
          <div className="card p-6 h-fit">
            <div className="text-center">
              <p className="text-6xl font-bold text-gray-900 dark:text-white mb-2">{product.ratings.toFixed(1)}</p>
              <StarRating rating={product.ratings} size="lg" />
              <p className="text-sm text-gray-500 mt-2">{product.numReviews} reviews</p>
            </div>
          </div>

          {/* Review list */}
          <div className="lg:col-span-2 space-y-4">
            {product.reviews?.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
            )}
            {product.reviews?.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700 dark:text-primary-400 text-sm">
                      {r.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{r.name}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-12">{r.comment}</p>
              </div>
            ))}

            {/* Add review form */}
            {user ? (
              <div className="card p-6 border-dashed border-2 border-gray-200 dark:border-zinc-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="label">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewForm((p) => ({ ...p, rating: s }))}>
                          <Star className={`w-7 h-7 transition-colors ${s <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                      rows={3}
                      placeholder="Share your experience..."
                      className="input resize-none"
                    />
                  </div>
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 card">
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">Login to write a review</p>
                <Link to="/login" className="btn-primary text-sm">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
