import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import Checkout from './pages/Checkout.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <TenantProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="*" element={<NotFoundPage isStoreNotFound={false} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TenantProvider>
  );
}
