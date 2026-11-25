import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatIDR } from '../lib/format.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group bg-white rounded-2xl border border-[var(--border-tint)] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Product Image Link */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/3] bg-slate-50 overflow-hidden"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-[var(--surface-tint)] text-[var(--color-primary)] border border-[var(--border-tint)] backdrop-blur-xs rounded-full shadow-2xs">
            {product.category}
          </span>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-xs text-slate-400">({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 text-base">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Short description */}
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-[var(--border-tint)] flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">
              Price
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              {formatIDR(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-150 active:scale-95 bg-[var(--color-primary)] hover:brightness-95"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
