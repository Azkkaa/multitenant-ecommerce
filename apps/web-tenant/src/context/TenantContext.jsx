import React, { createContext, useContext, useState, useEffect } from 'react';
import { resolveTenant } from '../lib/tenant.js';

const TenantContext = createContext(null);

/**
 * Generate a darker hex variant for hover/active states
 */
function getDarkerHex(hex, factor = 0.82) {
  try {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = Math.max(0, Math.min(255, Math.floor((num >> 16) * factor)));
    const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 0x00ff) * factor)));
    const b = Math.max(0, Math.min(255, Math.floor((num & 0x0000ff) * factor)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}

/**
 * Hardened Tenant Provider Component
 * Detects domain hostname, resolves single tenant data, sets dynamic metadata and CSS variables.
 * Exposes strictly the active tenant without leaking cross-tenant data.
 */
export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const resolved = resolveTenant(hostname);

    setTenant(resolved);
    setLoading(false);

    if (resolved && !resolved.isNotFound && resolved.themeColor) {
      const root = document.documentElement;
      const primaryHex = resolved.themeColor;
      const hoverHex = getDarkerHex(primaryHex, 0.85);

      root.style.setProperty('--color-primary', primaryHex);
      root.style.setProperty('--color-primary-hover', hoverHex);
      root.style.setProperty('--color-primary-light', `${primaryHex}18`);

      // Dynamically set document title to the merchant's storeName
      if (resolved.storeName) {
        document.title = resolved.storeName;
      }
    } else {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', '#475569');
      root.style.setProperty('--color-primary-hover', '#334155');
      root.style.setProperty('--color-primary-light', '#f1f5f9');
      document.title = 'Store Unavailable';
    }
  }, []);

  // Expose ONLY the single resolved tenant and loading/error status
  const value = {
    tenant: tenant && !tenant.isNotFound ? tenant : null,
    loading,
    error: tenant?.isNotFound ? (tenant.message || 'Store not found') : null
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Custom hook for accessing tenant context
 */
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
