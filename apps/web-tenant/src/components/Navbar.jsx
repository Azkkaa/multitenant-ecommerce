import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';
import { useTenant } from '../context/TenantContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { tenant } = useTenant();
  const { totalItems, openCart } = useCart();

  if (!tenant) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 transition-colors duration-300">
      {/* Top Store Announcement Bar (Authentic Indonesian Merchant Notice) */}
      <div className="bg-[var(--color-primary)] text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
        Selamat datang di {tenant.storeName} &mdash; Pengiriman cepat &amp; aman ke seluruh Indonesia
      </div>

      {/* Main Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[var(--border-tint)] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Authentic Merchant Brand (Logo & Name) */}
            <Link to="/" className="flex items-center gap-3 group">
              {tenant.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.storeName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-[var(--border-tint)] group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
              )}
              <span className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                {tenant.storeName}
              </span>
            </Link>

            {/* Navigation & Tinted Cart Button */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Catalog
              </Link>

              {/* Tinted Pill Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[var(--surface-tint)] text-slate-800 hover:bg-[var(--surface-tint-strong)] active:scale-95 transition-all border border-[var(--border-tint)] shadow-2xs"
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white rounded-full bg-[var(--color-primary)] shadow-xs transition-transform animate-in zoom-in-50 duration-150">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
