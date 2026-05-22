// src/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice > 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18 * 100) / 100;
  const grandTotal = totalPrice + shipping + tax;

  if (!user) return (
    <div className="container-page py-20">
      <EmptyState
        icon={ShoppingCart}
        title="Please login to view cart"
        description="You need to be logged in to access your shopping cart."
        action={<Link to="/login" className="btn-primary">Login Now</Link>}
      />
    </div>
  );

  if (items.length === 0) return (
    <div className="container-page py-20">
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Start shopping!"
        action={<Link to="/products" className="btn-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Shop Now</Link>}
      />
    </div>
  );

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-8">Shopping Cart <span className="text-gray-400 text-2xl font-normal">({items.length} items)</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            const image = product?.images?.[0]?.url || 'https://placehold.co/100x100';
            return (
              <div key={item._id} className="card p-5 flex gap-5">
                <Link to={`/products/${product?._id}`} className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800">
                  <img src={image} alt={product?.title} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/products/${product?._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 text-sm">
                        {product?.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">Unit price: ₹{item.price?.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(product._id)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1.5 text-sm font-medium text-gray-900 dark:text-white min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= (product?.stock || 99)}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal ({items.reduce((a,i) => a + i.quantity, 0)} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                  Add ₹{(999 - totalPrice).toLocaleString()} more for free shipping!
                </p>
              )}
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-lg shadow-primary-500/20">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/products" className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
