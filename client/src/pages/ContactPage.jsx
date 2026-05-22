// src/pages/ContactPage.jsx
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="container-page py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="section-title mb-3">Get In Touch</h1>
        <p className="text-gray-500 dark:text-gray-400">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: Mail,    title: 'Email Us',    value: 'support@shoplux.com' },
            { icon: Phone,   title: 'Call Us',     value: '+91 98765 43210' },
            { icon: MapPin,  title: 'Visit Us',    value: '123 Commerce St, Mumbai 400001' },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-0.5">{title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@email.com" required className="input" />
            </div>
          </div>
          <div>
            <label className="label">Subject</label>
            <input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="How can we help?" required className="input" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Your message..." required rows={5} className="input resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <Send className="w-4 h-4" />
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
