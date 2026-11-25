import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useTenant } from '../context/TenantContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatIDR } from '../lib/format.js';

const COURIER_OPTIONS = [
  { id: 'jne', name: 'JNE Regular', est: '2 - 3 Days', rate: 18000 },
  { id: 'jnt', name: 'J&T Express', est: '1 - 2 Days', rate: 19000 },
  { id: 'sicepat', name: 'SiCepat REG', est: '1 - 2 Days', rate: 17000 },
  { id: 'instant', name: 'Instant Delivery (Gojek/Grab)', est: '3 - 5 Hours', rate: 35000 }
];

/**
 * Validates Indonesian WhatsApp phone numbers (e.g., 08123456789, +628123456789, 628123456789)
 */
function isValidIndonesianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/.test(cleaned);
}

/**
 * Sanitizes phone input allowing only digits, spaces, hyphens, and leading plus sign
 */
function sanitizePhoneInput(val) {
  return val.replace(/[^0-9+\s-]/g, '');
}

export default function Checkout() {
  const { tenant } = useTenant();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    courierId: 'jne',
    paymentMethod: 'qris',
    notes: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  if (!tenant) return null;

  // Selected courier calculation
  const selectedCourier =
    COURIER_OPTIONS.find((c) => c.id === formData.courierId) || COURIER_OPTIONS[0];
  const shippingCost = items.length > 0 ? selectedCourier.rate : 0;
  const grandTotal = subtotal + shippingCost;

  // Field-level validation
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName': {
        const trimmed = value.trim();
        if (!trimmed) return 'Full name is required';
        if (trimmed.length < 2) return 'Full name must be at least 2 characters';
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name contains invalid characters';
        return null;
      }
      case 'phone': {
        const trimmed = value.trim();
        if (!trimmed) return 'WhatsApp phone number is required';
        if (!isValidIndonesianPhone(trimmed)) {
          return 'Enter a valid WhatsApp number (e.g. 081234567890 or +6281234567890)';
        }
        return null;
      }
      case 'address': {
        const trimmed = value.trim();
        if (!trimmed) return 'Delivery address is required';
        if (trimmed.length < 10) {
          return 'Please provide a full delivery address including street, district, and city';
        }
        return null;
      }
      default:
        return null;
    }
  };

  // Determine overall form validity for submit button state
  const isFormValid = useMemo(() => {
    const nameErr = validateField('fullName', formData.fullName);
    const phoneErr = validateField('phone', formData.phone);
    const addressErr = validateField('address', formData.address);
    return !nameErr && !phoneErr && !addressErr;
  }, [formData.fullName, formData.phone, formData.address]);

  // Handle Input Changes with live sanitization
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedVal = name === 'phone' ? sanitizePhoneInput(value) : value;

    setFormData((prev) => ({ ...prev, [name]: sanitizedVal }));

    if (touched[name]) {
      const err = validateField(name, sanitizedVal);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all required fields as touched
    setTouched({ fullName: true, phone: true, address: true });

    const nameErr = validateField('fullName', formData.fullName);
    const phoneErr = validateField('phone', formData.phone);
    const addressErr = validateField('address', formData.address);

    if (nameErr || phoneErr || addressErr || items.length === 0) {
      setErrors({ fullName: nameErr, phone: phoneErr, address: addressErr });
      return;
    }

    setIsSubmitting(true);

    // Securely sanitize customer submission payload
    const sanitizedCustomer = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim().replace(/[\s-]/g, ''),
      address: formData.address.trim(),
      notes: formData.notes.trim()
    };

    setTimeout(() => {
      const generatedId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const orderReceipt = {
        orderId: generatedId,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customer: sanitizedCustomer,
        courier: selectedCourier,
        items: [...items],
        subtotal,
        shippingCost,
        grandTotal,
        paymentMethod: formData.paymentMethod
      };

      setConfirmedOrder(orderReceipt);
      clearCart();
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyOrderId = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  // ==========================================
  // VIEW: ORDER CONFIRMED RECEIPT VIEW
  // ==========================================
  if (confirmedOrder) {
    const whatsappMessage = encodeURIComponent(
      `Halo ${tenant.storeName}, saya telah membuat pesanan dengan nomor ${confirmedOrder.orderId} senilai ${formatIDR(
        confirmedOrder.grandTotal
      )}. Mohon informasi status pengirimannya. Terima kasih!`
    );

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-[var(--border-tint)] shadow-sm overflow-hidden">
          {/* Header Banner with Warm Tinted Surface */}
          <div className="bg-[var(--surface-tint)] border-b border-[var(--border-tint)] p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--surface-tint-strong)] border border-[var(--border-tint)] px-3 py-1 rounded-full shadow-2xs">
              Order Confirmed & Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Thank You for Your Order!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Your order has been recorded with <strong className="text-slate-900">{tenant.storeName}</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Order Reference Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-page)] border border-[var(--border-tint)]">
              <div>
                <span className="text-xs font-medium text-slate-400 block">Order Identifier</span>
                <span className="text-lg font-mono font-bold text-slate-900">
                  {confirmedOrder.orderId}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">{confirmedOrder.date}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[var(--border-tint)] text-slate-700 hover:bg-[var(--surface-tint)] active:scale-95 transition-all shadow-2xs"
              >
                {copiedOrderId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Order ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Shipping Recipient
                </h2>
                <div className="text-sm text-slate-800 space-y-1">
                  <p className="font-semibold text-slate-900">{confirmedOrder.customer.fullName}</p>
                  <p className="text-slate-600 font-mono text-xs">{confirmedOrder.customer.phone}</p>
                  <p className="text-slate-600 text-xs leading-relaxed pt-1">
                    {confirmedOrder.customer.address}
                  </p>
                  {confirmedOrder.customer.notes && (
                    <p className="text-xs italic text-slate-500 pt-1">
                      Note: "{confirmedOrder.customer.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Delivery & Payment
                </h2>
                <div className="text-sm text-slate-800 space-y-2">
                  <div className="p-3 rounded-lg bg-[var(--surface-page)] border border-[var(--border-tint)] text-xs">
                    <span className="font-semibold block text-slate-900">
                      {confirmedOrder.courier.name}
                    </span>
                    <span className="text-slate-500 block">
                      Estimated Arrival: {confirmedOrder.courier.est}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--surface-page)] border border-[var(--border-tint)] text-xs">
                    <span className="font-semibold block text-slate-900">Payment Channel</span>
                    <span className="text-slate-500 uppercase font-mono">
                      {confirmedOrder.paymentMethod === 'qris'
                        ? 'QRIS Instant Payment'
                        : confirmedOrder.paymentMethod === 'bank_transfer'
                        ? 'Manual Bank Transfer'
                        : 'Cash on Delivery (COD)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Items Purchased ({confirmedOrder.items.length})
              </h2>
              <div className="divide-y divide-[var(--border-tint)] border border-[var(--border-tint)] rounded-xl overflow-hidden">
                {confirmedOrder.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-[var(--border-tint)] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} &times; {formatIDR(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                      {formatIDR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                {/* Calculation breakdown */}
                <div className="p-4 bg-[var(--surface-page)] space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span>{formatIDR(confirmedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee ({confirmedOrder.courier.name})</span>
                    <span>{formatIDR(confirmedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-[var(--border-tint)]">
                    <span>Grand Total</span>
                    <span>{formatIDR(confirmedOrder.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <Link
                to="/"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-[var(--surface-tint)] hover:bg-[var(--surface-tint-strong)] transition-colors text-center border border-[var(--border-tint)]"
              >
                Back to Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: EMPTY CART GUARD
  // ==========================================
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-tint)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="mt-2 text-sm text-slate-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submit button active condition
  const canSubmit = !isSubmitting && items.length > 0 && isFormValid;

  // ==========================================
  // VIEW: TWO-COLUMN CHECKOUT FORM & SUMMARY
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <nav className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-lg bg-white border border-[var(--border-tint)] shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Back</span>
        </button>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your delivery details for <span className="font-semibold text-slate-700">{tenant.storeName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ==========================================
              LEFT COLUMN: BUYER & SHIPPING DETAILS
             ========================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Recipient Details */}
            <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold shadow-2xs">
                  1
                </span>
                <span>Contact Information</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Raden Arya Pratama"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      touched.fullName && errors.fullName
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-[var(--border-tint)]'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 081234567890"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      touched.phone && errors.phone
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-[var(--border-tint)]'
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold shadow-2xs">
                  2
                </span>
                <span>Delivery Address</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address, District, & City <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan, 12190"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      touched.address && errors.address
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-[var(--border-tint)]'
                    }`}
                  />
                  {touched.address && errors.address && (
                    <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Note (Optional)
                  </label>
                  <input
                    id="notes"
                    name="notes"
                    type="text"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Leave with security desk"
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-tint)] text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Courier Selector */}
            <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold shadow-2xs">
                  3
                </span>
                <span>Shipping Courier</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COURIER_OPTIONS.map((courier) => {
                  const isSelected = formData.courierId === courier.id;
                  return (
                    <label
                      key={courier.id}
                      className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--surface-tint)] ring-1 ring-[var(--color-primary)]'
                          : 'border-[var(--border-tint)] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="courierId"
                          value={courier.id}
                          checked={isSelected}
                          onChange={handleChange}
                          className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-900">
                            {courier.name}
                          </span>
                          <span className="block text-[11px] text-slate-500">{courier.est}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {formatIDR(courier.rate)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ==========================================
              RIGHT COLUMN: ORDER SUMMARY CARD
             ========================================== */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[var(--border-tint)] p-6 shadow-sm sticky top-28">
              <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-[var(--border-tint)] flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-tint)] text-slate-700 border border-[var(--border-tint)]">
                  {items.length} items
                </span>
              </h2>

              {/* Items List */}
              <div className="py-4 space-y-3.5 max-h-72 overflow-y-auto divide-y divide-[var(--border-tint)]">
                {items.map((item) => (
                  <div key={item.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-[var(--border-tint)] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} &times; {formatIDR(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 flex-shrink-0">
                      {formatIDR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-4 border-t border-[var(--border-tint)] space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    Shipping <span className="text-slate-400 font-mono">({selectedCourier.name})</span>
                  </span>
                  <span className="font-semibold text-slate-800">{formatIDR(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-[var(--border-tint)]">
                  <span>Grand Total</span>
                  <span className="text-[var(--color-primary)]">{formatIDR(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA with Disabled State Enforced */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-md bg-[var(--color-primary)] hover:brightness-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place Order &bull; {formatIDR(grandTotal)}</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Dispatched securely by {tenant.storeName}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
