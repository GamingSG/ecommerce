// src/pages/user/OrderDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { LoadingScreen } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id).then(({ data }) => setOrder(data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!order) return <div className="container-page py-20 text-center text-gray-500">Order not found</div>;

  const STEPS = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = STEPS.indexOf(order.orderStatus);

  return (
    <div className="container-page py-10 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/orders" className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      {/* Progress tracker */}
      {order.orderStatus !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-500'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <div className="ml-2 flex-1">
                  <p className={`text-xs font-medium capitalize ${i <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>{step}</p>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-2 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-zinc-700'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {order.shippingAddress?.fullName} · {order.shippingAddress?.phone}<br />
              {order.shippingAddress?.street}, {order.shippingAddress?.city},<br />
              {order.shippingAddress?.state} – {order.shippingAddress?.zipCode}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.itemsPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-zinc-800 pt-2">
              <span>Total</span><span>₹{order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-500">
            <p>Payment: <span className="capitalize">{order.paymentMethod}</span></p>
            <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
            {order.isDelivered && <p>Delivered: {new Date(order.deliveredAt).toLocaleDateString()}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
