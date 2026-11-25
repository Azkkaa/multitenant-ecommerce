import React, { useState, useMemo } from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Search, X, SlidersHorizontal } from 'lucide-react';
import { useTenant } from '../context/TenantContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function HomePage() {
  const { tenant } = useTenant();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!tenant) return null;

  // Extract unique categories dynamically from the current merchant's catalog
  const categories = useMemo(() => {
    if (!tenant.products) return ['All'];
    const unique = Array.from(new Set(tenant.products.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [tenant.products]);

  // Filter products based on search query and active category pill
  const filteredProducts = useMemo(() => {
    if (!tenant.products) return [];
    return tenant.products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [tenant.products, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="pb-20">
      {/* Warm Framed Hero Section (Authentic Indonesian UMKM Merchant Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--surface-tint)] border border-[var(--border-tint)] p-6 sm:p-10 md:p-12 shadow-xs">
          {/* Subtle dynamic glow matching tenant theme */}
          <div
            className="absolute -top-32 right-0 w-[500px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: tenant.themeColor }}
          />

          <div className="relative max-w-3xl">
            {/* Official Online Store Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 bg-[var(--surface-tint-strong)] text-[var(--color-primary)] border border-[var(--border-tint)] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Official Online Store</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {tenant.storeName}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {tenant.tagline ||
                'Explore our hand-selected catalog of premium quality products, prepared exclusively for our community.'}
            </p>

            {/* Store Value Highlights (Lively cohesive mini-cards with primary-tinted icon badges) */}
            <div className="mt-8 pt-6 border-t border-[var(--border-tint)] grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-[var(--border-tint)] text-xs text-slate-700 font-medium shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-tint-strong)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Express Regional Shipping</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-[var(--border-tint)] text-xs text-slate-700 font-medium shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-tint-strong)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>100% Genuine Quality</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-[var(--border-tint)] text-xs text-slate-700 font-medium shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-tint-strong)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span>Guaranteed Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog & Interactive Controls Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header with Title and Product Counter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Curated Catalog
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Discover official items from {tenant.storeName}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--surface-tint)] text-slate-700 border border-[var(--border-tint)] w-fit">
            Showing {filteredProducts.length} of {tenant.products?.length || 0} items
          </span>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-4 mb-8">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or keywords..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--border-tint)] text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 pl-1 pr-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>

            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'text-white bg-[var(--color-primary)] shadow-xs'
                      : 'bg-white border border-[var(--border-tint)] text-slate-600 hover:bg-[var(--surface-tint)] hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive CSS Grid mapping */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search & Filter State */
          <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-tint)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
            <p className="mt-1 text-xs text-slate-500">
              No products found matching "{searchQuery}". Try searching with different keywords or clearing active filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 transition-all shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
