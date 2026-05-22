// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Trash2, Shield, ShieldOff, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    userAPI.getAll().then(({ data }) => setUsers(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await userAPI.update(userId, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) { toast.error(err.message || 'Failed'); }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await userAPI.update(userId, { isActive: !isActive });
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) { toast.error(err.message || 'Failed'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userAPI.delete(deleteModal.id);
      toast.success('User deleted');
      setDeleteModal({ open: false, id: null });
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{users.length} registered users</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-3 px-4"><div className="h-10 skeleton rounded" /></td></tr>
                ))
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700 dark:text-primary-400 text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`badge capitalize ${user.role === 'admin' ? 'badge-purple' : 'badge-info'}`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleRoleToggle(user._id, user.role)}
                            title="Toggle admin"
                            className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(user._id, user.isActive !== false)}
                            title="Toggle active"
                            className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          >
                            <ShieldOff className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, id: user._id, name: user.name })}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && users.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.name}"? This cannot be undone.`}
      />
    </div>
  );
}
