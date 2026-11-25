import React from 'react';
import { Store } from 'lucide-react';
import { useTenant } from '../context/TenantContext.jsx';

export default function Footer() {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return (
    <footer className="mt-auto bg-[var(--surface-tint)] border-t border-[var(--border-tint)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Authentic Merchant Brand & Brief Description */}
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              {tenant.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.storeName}
                  className="w-8 h-8 rounded-lg object-cover border border-[var(--border-tint)] shadow-2xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center shadow-2xs">
                  <Store className="w-4 h-4" />
                </div>
              )}
              <span className="text-base font-bold text-slate-900 leading-tight">
                {tenant.storeName}
              </span>
            </div>

            {tenant.tagline && (
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {tenant.tagline}
              </p>
            )}
          </div>

          {/* Clean Authentic Copyright Notice */}
          <div className="text-xs text-slate-500 sm:text-right">
            <p>&copy; 2026 {tenant.storeName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
