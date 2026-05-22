// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { Package, User, Heart, ShoppingBag } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMy().then(({ data }) => setOrders(data.data)).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Orders',    value: orders.length,                                       icon: Package,  to: '/orders' },
    { label: 'Delivered',       value: orders.filter(o => o.orderStatus === 'delivered').length, icon: ShoppingBag, to: '/orders' },
    { label: 'Wishlist Items',  value: user?.wishlist?.length || 0,                          icon: Heart,    to: '/wishlist' },
  ];

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your account</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="card-hover p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No orders yet. <Link to="/products" className="text-primary-600 hover:underline">Start shopping!</Link></p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · {order.orderItems.length} item(s)</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-sm">₹{order.totalPrice?.toFixed(2)}</p>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
