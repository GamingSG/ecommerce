// src/pages/user/ProfilePage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, MapPin, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, email: form.email };
    if (form.password) payload.password = form.password;
    if (form.street) payload.address = { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode };
    await updateProfile(payload);
  };

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="section-title mb-8">My Profile</h1>

      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-bold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="mt-1 inline-block badge badge-purple capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary-500" /> Personal Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> Address</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'street',  label: 'Street', full: true },
                { key: 'city',    label: 'City' },
                { key: 'state',   label: 'State' },
                { key: 'zipCode', label: 'PIN Code' },
              ].map(({ key, label, full }) => (
                <div key={key} className={full ? 'sm:col-span-2' : ''}>
                  <label className="label">{label}</label>
                  <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} className="input" />
                </div>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-primary-500" /> Change Password</h3>
            <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Leave blank to keep current password" className="input" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
