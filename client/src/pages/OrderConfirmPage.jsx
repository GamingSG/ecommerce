// src/pages/OrderConfirmPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { LoadingScreen } from '../components/common/Spinner';
import OrderStatusBadge from '../components/common/OrderStatusBadge';

export default function OrderConfirmPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id).then(({ data }) => setOrder(data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!order) return <div className="container-page py-20 text-center text-gray-500">Order not found</div>;

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400">Thank you for your purchase. We'll send you a confirmation shortly.</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
            <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <OrderStatusBadge status={order.orderStatus} />
        </div>

        {/* Items */}
        <div className="space-y-3 mb-5">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-zinc-800" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.itemsPrice?.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
          <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1 border-t border-gray-100 dark:border-zinc-800">
            <span>Total</span><span>₹{order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="card p-5 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Shipping Address</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {order.shippingAddress?.fullName}<br />
          {order.shippingAddress?.street}, {order.shippingAddress?.city},<br />
          {order.shippingAddress?.state} – {order.shippingAddress?.zipCode}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/orders" className="btn-outline flex-1 text-center flex items-center justify-center gap-2">
          <Package className="w-4 h-4" /> View All Orders
        </Link>
        <Link to="/products" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
