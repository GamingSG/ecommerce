// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import Pagination from '../../components/common/Pagination';
import { Link } from 'react-router-dom';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await orderAPI.getAll(params);
      setOrders(data.data);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderAPI.updateStatus(orderId, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally { setUpdatingId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pagination.total} orders total</p>
        </div>
        {/* Status filter */}
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto py-2 text-sm">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update Status'].map((h) => (
                  <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {loading ? (
                Array(10).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="py-3 px-4"><div className="h-10 skeleton rounded" /></td></tr>
                ))
              ) : orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/orders/${order._id}`} className="font-mono text-xs text-primary-600 dark:text-primary-400 hover:underline">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-xs text-gray-900 dark:text-white">{order.user?.name}</p>
                    <p className="text-gray-400 text-xs truncate max-w-[120px]">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs">{order.orderItems?.length}</td>
                  <td className="py-3 px-4 font-semibold text-xs text-gray-900 dark:text-white">₹{order.totalPrice?.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-info capitalize text-xs">{order.paymentMethod}</span>
                  </td>
                  <td className="py-3 px-4"><OrderStatusBadge status={order.orderStatus} /></td>
                  <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id || order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-lg px-2 py-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      <Pagination page={pagination.page || page} pages={pagination.pages} onChange={setPage} />
    </div>
  );
}
