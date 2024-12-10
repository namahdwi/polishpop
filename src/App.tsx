import React, { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PromotionBanner from './components/PromotionBanner';
import { usePromotionStore } from './store/promotionStore';
import CustomerPortal from './components/Account/CustomerPortal';
import AdminDashboard from './components/Admin/Dashboard';
import { AdminRoute, ProtectedRoute } from './routes/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// Lazy load non-critical components
const Hero = React.lazy(() => import('./components/Hero'));
const OrderFlow = React.lazy(() => import('./components/OrderFlow/OrderFlow'));
const TrendingDesigns = React.lazy(() => import('./components/TrendingDesigns'));
const SizeChecker = React.lazy(() => import('./components/SizeChecker'));
const Catalog = React.lazy(() => import('./components/Catalog'));

const HomePage = () => (
  <>
    <Hero />
    <OrderFlow />
    <TrendingDesigns />
    <SizeChecker />
    <Catalog />
  </>
);

export default function App() {
  const { loading, initialized, init } = useAuthStore();
  const { fetchActivePromotions } = usePromotionStore();

  useEffect(() => {
    const initAuth = async () => {
      const unsubscribe = await init();
      return unsubscribe;
    };
    
    initAuth();
    return () => {
      initAuth().then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  useEffect(() => {
    fetchActivePromotions();
  }, [fetchActivePromotions]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>PolishPop - Custom Nail Designs</title>
        <meta name="description" content="Discover unique nail art designs crafted by indie artists. Find your perfect style with our custom nail art collections." />
        <meta property="og:title" content="PolishPop - Custom Nail Designs" />
        <meta property="og:description" content="Discover unique nail art designs crafted by indie artists." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <PromotionBanner />
        
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <CustomerPortal />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}