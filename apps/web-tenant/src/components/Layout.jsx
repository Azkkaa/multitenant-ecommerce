import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import CartDrawer from './CartDrawer.jsx';
import { useTenant } from '../context/TenantContext.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function Layout() {
  const { tenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Loading storefront...</p>
        </div>
      </div>
    );
  }

  // If the merchant domain is not recognized, display the Store Not Found screen
  if (!tenant || tenant.isNotFound) {
    return <NotFoundPage isStoreNotFound={true} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-page)] text-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
