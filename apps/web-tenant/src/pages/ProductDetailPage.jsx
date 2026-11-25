import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Check, Shield, Truck, Package } from 'lucide-react';
import { useTenant } from '../context/TenantContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatIDR } from '../lib/format.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { tenant } = useTenant();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!tenant) return null;

  const product = tenant.products?.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--surface-tint)] text-[var(--color-primary)] flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
          <p className="mt-2 text-sm text-slate-500">
            The requested product does not exist in {tenant.storeName}'s catalog.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb / Back Navigation */}
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-lg bg-white border border-[var(--border-tint)] shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Back to products</span>
        </Link>
      </nav>

      {/* Main Details Grid with Crisp White Cards on Surface Page */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        {/* Product Media Card */}
        <div className="bg-white rounded-2xl border border-[var(--border-tint)] overflow-hidden shadow-xs aspect-square relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.category && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--surface-tint)] text-[var(--color-primary)] border border-[var(--border-tint)] backdrop-blur-xs shadow-2xs">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Information Card */}
        <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-6 sm:p-8 shadow-xs flex flex-col">
          <div className="border-b border-[var(--border-tint)] pb-6">
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
                )}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatIDR(product.price)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/50">
                In Stock &bull; Ready to Ship
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-[var(--border-tint)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Key Specifications
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* Stepper */}
              <div className="flex items-center border border-[var(--border-tint)] rounded-xl bg-white overflow-hidden w-fit shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-[var(--surface-tint)] active:bg-[var(--surface-tint-strong)] font-bold transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-[var(--surface-tint)] active:bg-[var(--surface-tint-strong)] font-bold transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:brightness-95 active:scale-[0.99] transition-all shadow-xs"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>Added {quantity} to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart &bull; {formatIDR(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-slate-500 pt-4 border-t border-[var(--border-tint)]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Authorized {tenant.storeName} Seller</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Fast nationwide delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
