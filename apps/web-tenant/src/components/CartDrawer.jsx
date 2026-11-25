import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatIDR } from '../lib/format.js';

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();

  // Close drawer on Escape key press and manage body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Shopping Cart Drawer"
        aria-modal="true"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header with Warm Surface Tint */}
        <div className="px-5 py-4 border-b border-[var(--border-tint)] flex items-center justify-between bg-[var(--surface-tint)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-tint-strong)] text-[var(--color-primary)] flex items-center justify-center shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Shopping Cart
              </h2>
              <span className="text-xs text-slate-500">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-[var(--surface-tint-strong)] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-tint)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Looks like you haven't added anything to your cart yet. Explore our curated catalog.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-6 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 transition-all shadow-xs"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[var(--border-tint)]">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-[var(--border-tint)] bg-slate-50 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-slate-900 hover:text-[var(--color-primary)] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {formatIDR(item.price)} each
                    </div>

                    {/* Stepper & Item Total */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[var(--border-tint)] rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 text-slate-500 hover:bg-[var(--surface-tint)] active:bg-[var(--surface-tint-strong)] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 text-slate-500 hover:bg-[var(--surface-tint)] active:bg-[var(--surface-tint-strong)] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-slate-900">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Warm Subtotal & Proceed to Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[var(--border-tint)] bg-[var(--surface-tint)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Subtotal</span>
              <span className="text-lg font-extrabold text-slate-900">
                {formatIDR(subtotal)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Shipping & taxes calculated at checkout.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-md bg-[var(--color-primary)] hover:brightness-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={closeCart}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Or Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
