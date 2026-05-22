// src/components/common/OrderStatusBadge.jsx
export default function OrderStatusBadge({ status }) {
  const map = {
    pending:    { cls: 'badge-warning', label: 'Pending' },
    processing: { cls: 'badge-info',    label: 'Processing' },
    shipped:    { cls: 'badge-purple',  label: 'Shipped' },
    delivered:  { cls: 'badge-success', label: 'Delivered' },
    cancelled:  { cls: 'badge-danger',  label: 'Cancelled' },
  };
  const { cls, label } = map[status] || { cls: 'badge-info', label: status };
  return <span className={cls}>{label}</span>;
}
