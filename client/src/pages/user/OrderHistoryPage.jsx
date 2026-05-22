// src/pages/user/OrderHistoryPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Package, ChevronRight } from 'lucide-react';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMy().then(({ data }) => setOrders(data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10 max-w-4xl">
      <h1 className="section-title mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" description="Your order history will appear here."
          action={<Link to="/products" className="btn-primary">Shop Now</Link>} />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card-hover p-5 flex items-center gap-5 block">
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' · '}{order.orderItems.length} item(s)
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {order.orderItems.slice(0, 3).map((item) => (
                    <img key={item._id} src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toFixed(2)}</p>
                <div className="mt-1"><OrderStatusBadge status={order.orderStatus} /></div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
