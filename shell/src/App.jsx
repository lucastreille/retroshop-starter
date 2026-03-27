import React, { useState, useEffect, Suspense, lazy } from 'react';
import eventBus from 'shared/eventBus';
import { EVENTS } from 'shared/events';
import './App.css';

const ProductGrid = lazy(() => import('mfe_product/ProductGrid'));
const Cart = lazy(() => import('mfe_cart/Cart'));
const Recommendations = lazy(() =>
  import('mfe_reco/Recommendations').catch(() => ({
    default: function RecommendationsUnavailable() {
      return <div className="loading-fallback">Recommandations indisponibles</div>;
    },
  }))
);

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.CART_UPDATED, ({ count }) => {
      setCartCount(count);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="shell">
      <header className="shell-header">
        <h1 className="logo">RetroShop</h1>
        <div className="cart-badge">Panier ({cartCount})</div>
      </header>
      <main className="shell-main">
        <section className="product-area">
          <Suspense fallback={<LoadingFallback name="catalogue" />}>
            <ProductGrid />
          </Suspense>
        </section>
        <aside className="cart-area">
          <Suspense fallback={<LoadingFallback name="panier" />}>
            <Cart />
          </Suspense>
        </aside>
      </main>
      <section className="reco-area">
        <Suspense fallback={<LoadingFallback name="recommandations" />}>
          <Recommendations />
        </Suspense>
      </section>
    </div>
  );
}

export default App;
