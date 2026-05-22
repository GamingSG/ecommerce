// src/pages/AboutPage.jsx
import { ShieldCheck, Truck, HeartHandshake, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="section-title mb-4">About ShopLux</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          ShopLux is your premium destination for curated products across electronics, fashion, home, and more.
          Founded in 2020, we've served over 50,000 customers across India with a commitment to quality, value, and trust.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: ShieldCheck, title: 'Quality Assured', desc: 'Every product is vetted for quality before listing.' },
          { icon: Truck,       title: 'Fast Delivery',   desc: 'Delivery in 2-5 business days across India.' },
          { icon: HeartHandshake, title: '24/7 Support', desc: 'Our team is always here to help you.' },
          { icon: Globe,       title: 'Pan India',        desc: 'We deliver to every corner of the country.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        {[['50K+', 'Happy Customers'], ['10K+', 'Products Listed'], ['4.9/5', 'Average Rating']].map(([val, label]) => (
          <div key={label} className="card p-8">
            <p className="font-display text-5xl font-bold gradient-text mb-2">{val}</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
