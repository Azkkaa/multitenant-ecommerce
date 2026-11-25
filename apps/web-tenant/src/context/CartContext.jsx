import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useTenant } from './TenantContext.jsx';
import { CheckCircle, X } from 'lucide-react';
import { formatIDR } from '../lib/format.js';

const CartContext = createContext(null);

/**
 * Hardened Multi-Tenant Cart Provider
 * - Persists strictly minimal `{ productId, quantity }` payload in localStorage.
 * - Dynamically resolves titles, images, and authoritative prices from the active tenant catalog.
 * - Completely immune to client-side localStorage price tampering.
 */
export function CartProvider({ children }) {
  const { tenant } = useTenant();
  const tenantId = tenant?.tenantId || null;

  // Stored state: strictly array of { productId, quantity }
  const [rawEntries, setRawEntries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', product: null });
  const toastTimeoutRef = useRef(null);
  const isLoadedRef = useRef(false);

  // Load and sanitize cart from scoped localStorage whenever tenant changes
  useEffect(() => {
    if (!tenantId) {
      setRawEntries([]);
      isLoadedRef.current = false;
      return;
    }

    try {
      const stored = localStorage.getItem(`cart_${tenantId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Normalize entries and enforce integer quantities
          const sanitized = parsed
            .map((entry) => {
              const pid = entry?.productId || entry?.id;
              const qty = Math.max(1, parseInt(entry?.quantity, 10) || 1);
              return pid ? { productId: String(pid), quantity: qty } : null;
            })
            .filter(Boolean);
          setRawEntries(sanitized);
        } else {
          setRawEntries([]);
        }
      } else {
        setRawEntries([]);
      }
    } catch {
      setRawEntries([]);
    } finally {
      isLoadedRef.current = true;
    }
  }, [tenantId]);

  // Persist strictly { productId, quantity } payload to localStorage
  useEffect(() => {
    if (!tenantId || !isLoadedRef.current) return;

    try {
      const minimalPayload = rawEntries.map((entry) => ({
        productId: entry.productId,
        quantity: entry.quantity
      }));
      localStorage.setItem(`cart_${tenantId}`, JSON.stringify(minimalPayload));
    } catch {
      // Handle quota or restricted storage safely
    }
  }, [rawEntries, tenantId]);

  // Authoritative dynamic resolution against current tenant's official product catalog
  const items = useMemo(() => {
    if (!tenant?.products || !Array.isArray(rawEntries)) return [];

    const catalogMap = new Map(tenant.products.map((p) => [p.id, p]));

    return rawEntries
      .map((entry) => {
        const catalogProduct = catalogMap.get(entry.productId);
        // If a product has been removed from the catalog or doesn't exist, safely omit it
        if (!catalogProduct) return null;

        return {
          ...catalogProduct,
          id: catalogProduct.id,
          productId: catalogProduct.id,
          quantity: entry.quantity,
          // Authoritative price directly from verified merchant catalog
          price: Number(catalogProduct.price) || 0
        };
      })
      .filter(Boolean);
  }, [tenant?.products, rawEntries]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
    [items]
  );

  // Toast notification helper
  const showToast = (product, quantity = 1) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({
      visible: true,
      message:
        quantity > 1
          ? `Added ${quantity}x "${product.name}" to cart`
          : `Added "${product.name}" to cart`,
      product
    });

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', product: null });
    }, 3200);
  };

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ visible: false, message: '', product: null });
  };

  const addToCart = (productOrId, quantity = 1) => {
    const pid =
      typeof productOrId === 'object' && productOrId !== null
        ? productOrId.id || productOrId.productId
        : productOrId;

    if (!pid) return;

    // Verify item exists in current merchant's catalog
    const catalogItem = tenant?.products?.find((p) => p.id === pid);
    if (!catalogItem) return;

    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    setRawEntries((prev) => {
      const existingIdx = prev.findIndex((entry) => entry.productId === pid);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          productId: pid,
          quantity: next[existingIdx].quantity + addQty
        };
        return next;
      }
      return [...prev, { productId: pid, quantity: addQty }];
    });

    showToast(catalogItem, addQty);
  };

  const updateQuantity = (productId, delta) => {
    setRawEntries((prev) =>
      prev
        .map((entry) => {
          if (entry.productId === productId) {
            const nextQty = entry.quantity + delta;
            return nextQty > 0 ? { productId, quantity: nextQty } : null;
          }
          return entry;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setRawEntries((prev) => prev.filter((entry) => entry.productId !== productId));
  };

  const clearCart = () => {
    setRawEntries([]);
    if (tenantId) {
      try {
        localStorage.removeItem(`cart_${tenantId}`);
      } catch {
        // Safe fallback
      }
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value = {
    items,
    isOpen,
    totalItems,
    subtotal,
    toast,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    dismissToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Non-Intrusive Toast Notification */}
      {toast.visible && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 p-3.5 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700/60 backdrop-blur max-w-sm animate-in slide-in-from-bottom-3 duration-200"
        >
          {toast.product?.imageUrl ? (
            <img
              src={toast.product.imageUrl}
              alt=""
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs font-semibold text-slate-100 truncate">{toast.message}</p>
            {toast.product?.price && (
              <p className="text-xs text-slate-400 mt-0.5">{formatIDR(toast.product.price)}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                dismissToast();
                openCart();
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[var(--color-primary)] text-white hover:brightness-110 transition-all"
            >
              View Cart
            </button>
            <button
              type="button"
              onClick={dismissToast}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to access cart state
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
