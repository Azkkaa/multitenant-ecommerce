import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Store, ArrowRight } from 'lucide-react';
import { useTenant } from '../context/TenantContext.jsx';

export default function NotFoundPage({ isStoreNotFound = false }) {
  const { tenant } = useTenant();

  const storeMissing = isStoreNotFound || tenant?.isNotFound;

  if (storeMissing) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-8 shadow-2xl backdrop-blur text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
            <Store className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Storefront Unavailable
          </h1>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            This store is currently unavailable or inactive. Please verify the URL or contact the merchant directly.
          </p>
        </div>
      </div>
    );
  }

  // Generic 404 inside a valid tenant store
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        The page you are looking for does not exist on {tenant?.storeName || 'this store'}.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 transition-all shadow-xs"
        >
          <span>Return to Storefront</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
