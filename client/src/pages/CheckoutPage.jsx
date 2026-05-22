// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { ShieldCheck, CreditCard, Truck, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod',     label: 'Cash on Delivery',  icon: Wallet,     desc: 'Pay when you receive' },
  { id: 'stripe',  label: 'Credit / Debit Card', icon: CreditCard, desc: 'Powered by Stripe' },
  { id: 'razorpay',label: 'UPI / Net Banking',  icon: ShieldCheck, desc: 'Powered by Razorpay' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: 'India',
  });

  const shipping = totalPrice > 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18 * 100) / 100;
  const grandTotal = totalPrice + shipping + tax;

  const handleAddressChange = (e) => setAddress((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'street', 'city', 'state', 'zipCode'];
    for (const f of required) {
      if (!address[f].trim()) { toast.error(`Please enter ${f}`); return false; }
    }
    if (!/^\d{10}$/.test(address.phone)) { toast.error('Enter a valid 10-digit phone number'); return false; }
    return true;
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.create({ shippingAddress: address, paymentMethod });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirm/${data.data._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (items.length === 0) return (
    <div className="container-page py-20 text-center">
      <p className="text-gray-500 mb-4">Your cart is empty.</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {['Shipping', 'Payment', 'Review'].map((label, i) => {
          const s = i + 1;
          return (
            <div key={label} className="flex items-center">
              <div className={`flex items-center gap-2 ${step >= s ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-500'}`}>
                  {s}
                </div>
                <span className="hidden sm:block text-sm font-medium">{label}</span>
              </div>
              {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-zinc-700'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-600" /> Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'fullName',  label: 'Full Name',    placeholder: 'John Doe',      full: true },
                  { name: 'phone',     label: 'Phone Number', placeholder: '9876543210',    full: false },
                  { name: 'street',    label: 'Street Address',placeholder: '123 Main St', full: true },
                  { name: 'city',      label: 'City',         placeholder: 'Mumbai',        full: false },
                  { name: 'state',     label: 'State',        placeholder: 'Maharashtra',   full: false },
                  { name: 'zipCode',   label: 'PIN Code',     placeholder: '400001',        full: false },
                ].map(({ name, label, placeholder, full }) => (
                  <div key={name} className={full ? 'sm:col-span-2' : ''}>
                    <label className="label">{label}</label>
                    <input name={name} value={address[name]} onChange={handleAddressChange}
                      placeholder={placeholder} className="input" />
                  </div>
                ))}
                <div>
                  <label className="label">Country</label>
                  <input value="India" disabled className="input opacity-60 cursor-not-allowed" />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => { if (validateAddress()) setStep(2); }} className="btn-primary px-8 py-3">
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" /> Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                  <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-primary-600" />
                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {paymentMethod !== 'cod' && (
                <p className="mt-4 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                  ⚠️ Demo mode: Payment gateway not integrated. Your order will be placed and marked as pending.
                </p>
              )}
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary px-8 py-3">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Review Your Order</h2>

              {/* Address summary */}
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping To</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {address.fullName} · {address.phone}<br />
                  {address.street}, {address.city}, {address.state} – {address.zipCode}
                </p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 capitalize">{paymentMethod.replace('_', ' ')}</p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.product?.images?.[0]?.url || 'https://placehold.co/60x60'} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product?.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                    </div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
                <button onClick={placeOrder} disabled={loading} className="btn-primary px-8 py-3 shadow-lg shadow-primary-500/20">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : '✓ Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="card p-5 sticky top-24">
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>GST (18%)</span><span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              Secured by 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
