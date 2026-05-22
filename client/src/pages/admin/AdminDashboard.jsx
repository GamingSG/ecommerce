// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, Clock } from 'lucide-react';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [orderStats, setOrderStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderAPI.getStats(),
      userAPI.getStats(),
      productAPI.getAll({ limit: 1 }),
    ]).then(([os, us, ps]) => {
      setOrderStats(os.data.data);
      setUserStats(us.data.data);
      setProductCount(ps.data.pagination?.total || 0);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
      </div>
    </div>
  );

  const stats = [
    { icon: ShoppingBag, label: 'Total Revenue',  value: `₹${orderStats?.totalRevenue?.toLocaleString() || 0}`, sub: 'All time', color: 'bg-primary-500' },
    { icon: Package,     label: 'Total Orders',   value: orderStats?.totalOrders || 0, sub: `${orderStats?.pendingOrders} pending`, color: 'bg-amber-500' },
    { icon: Users,       label: 'Total Users',    value: userStats?.totalUsers || 0, sub: `${userStats?.newUsersThisMonth} this month`, color: 'bg-blue-500' },
    { icon: DollarSign,  label: 'Products Listed', value: productCount, color: 'bg-emerald-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" /> Recent Orders
          </h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {orderStats?.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-2">
                    <Link to={`/orders/${order._id}`} className="font-mono text-xs text-primary-600 dark:text-primary-400 hover:underline">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{order.user?.name}</p>
                      <p className="text-gray-400 text-xs">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400 text-xs">{order.orderItems?.length}</td>
                  <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white text-xs">₹{order.totalPrice?.toFixed(2)}</td>
                  <td className="py-3 px-2"><OrderStatusBadge status={order.orderStatus} /></td>
                  <td className="py-3 px-2 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
