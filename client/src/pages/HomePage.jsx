// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Star, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics',   emoji: '💻', color: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing',      emoji: '👗', color: 'from-pink-500 to-rose-500' },
  { name: 'Home & Garden', emoji: '🏡', color: 'from-green-500 to-emerald-500' },
  { name: 'Sports',        emoji: '⚽', color: 'from-orange-500 to-amber-500' },
  { name: 'Beauty',        emoji: '✨', color: 'from-purple-500 to-primary-500' },
  { name: 'Books',         emoji: '📚', color: 'from-indigo-500 to-blue-500' },
];

const FEATURES = [
  { icon: Truck,       title: 'Free Shipping',       desc: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Secure Payment',       desc: '100% secure transactions' },
  { icon: RefreshCw,   title: 'Easy Returns',         desc: '30-day return policy' },
  { icon: Headphones,  title: '24/7 Support',         desc: 'Round-the-clock help' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getAll({ featured: 'true', limit: 4 });
        setFeatured(data.data);
      } finally { setLoadingFeatured(false); }
    };
    const fetchTrending = async () => {
      try {
        const { data } = await productAPI.getTop();
        setTrending(data.data.slice(0, 8));
      } finally { setLoadingTrending(false); }
    };
    fetchFeatured();
    fetchTrending();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-primary-950" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-accent-200/40 dark:bg-accent-900/20 rounded-full blur-3xl" />

        <div className="container-page relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                New Arrivals 2025
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Discover <span className="gradient-text">Premium</span><br />Products
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                Shop the latest trends across electronics, fashion, home essentials and more — curated just for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary flex items-center gap-2 text-base py-3 px-8 shadow-lg shadow-primary-500/25">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products?featured=true" className="btn-outline flex items-center gap-2 text-base py-3 px-8">
                  View Featured
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{val}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-scale-in">
              {[
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300',
                'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              ].map((src, i) => (
                <div key={i} className={`overflow-hidden rounded-2xl shadow-xl ${i === 1 || i === 2 ? 'mt-6' : ''}`}>
                  <img src={src} alt="" className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="py-10 bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container-page py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ name, emoji, color }) => (
            <Link
              key={name}
              to={`/products?category=${encodeURIComponent(name)}`}
              className="group card-hover p-5 text-center"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                {emoji}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-gray-50 dark:bg-zinc-900/50 py-20">
        <div className="container-page">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Handpicked premium selections</p>
            </div>
            <Link to="/products?featured=true" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingFeatured
              ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : featured.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ── Promotional Banner ── */}
      <section className="container-page py-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-500 p-10 md:p-16 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-white/10 rounded-full translate-y-1/2" />
          <div className="relative z-10 max-w-lg">
            <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-widest">Limited Time Offer</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Up to 50% Off on Electronics</h2>
            <p className="text-white/80 mb-8">Shop the biggest sale of the year. Free shipping included on all orders above ₹999.</p>
            <Link to="/products?category=Electronics" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trending Products ── */}
      <section className="bg-gray-50 dark:bg-zinc-900/50 py-20">
        <div className="container-page">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Trending Now</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">What everyone's buying</p>
            </div>
            <Link to="/products?sort=rating" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingTrending
              ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : trending.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="container-page py-20">
        <h2 className="section-title text-center mb-3">What Our Customers Say</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Trusted by thousands of happy shoppers</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Priya S.', text: 'Amazing quality products and super fast delivery! Will definitely order again.', rating: 5, avatar: 'P' },
            { name: 'Rahul M.', text: 'The customer service is excellent. They resolved my issue within hours. Highly recommend!', rating: 5, avatar: 'R' },
            { name: 'Ananya K.', text: 'Love the variety of products. The prices are unbeatable and packaging was perfect.', rating: 4, avatar: 'A' },
          ].map(({ name, text, rating, avatar }) => (
            <div key={name} className="card p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array(rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700 dark:text-primary-400">
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
