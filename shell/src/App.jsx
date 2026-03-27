import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import { EVENTS } from 'shared/events';
import './App.css';

const loadProductGrid = () => import('mfe_product/ProductGrid');
const loadCart = () => import('mfe_cart/Cart');
const loadRecommendations = () => import('mfe_reco/Recommendations');

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function OfflineFallback({ name }) {
  return <div className="loading-fallback">{name} indisponible</div>;
}

function RemoteMFE({ name, importFn }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setComponent(null);
    setError(false);
    setLoading(true);

    importFn()
      .then((mod) => {
        if (cancelled) return;

        setComponent(() => mod.default);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(`[MFE] ${name} indisponible:`, err.message);

        if (cancelled) return;

        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name, importFn]);

  if (loading) {
    return <LoadingFallback name={name} />;
  }

  if (error || !Component) {
    return <OfflineFallback name={name} />;
  }

  return <Component />;
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
          <RemoteMFE name="catalogue" importFn={loadProductGrid} />
        </section>
        <aside className="cart-area">
          <RemoteMFE name="panier" importFn={loadCart} />
        </aside>
      </main>
      <section className="reco-area">
        <RemoteMFE name="recommandations" importFn={loadRecommendations} />
      </section>
    </div>
  );
}

export default App;
