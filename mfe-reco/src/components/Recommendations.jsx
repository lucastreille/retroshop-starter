import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import { EVENTS } from 'shared/events';
import PRODUCTS from 'shared/products';
import './Recommendations.css';

function Recommendations() {
  const [recos, setRecos] = useState(PRODUCTS.slice(0, 3));

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.CART_UPDATED, ({ items }) => {
      if (items.length === 0) {
        setRecos(PRODUCTS.slice(0, 3));
        return;
      }

      const cartIds = new Set(items.map(item => item.id));
      const cartCategories = new Set(items.map(item => item.category));

      const preferred = PRODUCTS.filter(
        product => !cartIds.has(product.id) && cartCategories.has(product.category)
      );
      const fallback = PRODUCTS.filter(
        product => !cartIds.has(product.id) && !cartCategories.has(product.category)
      );

      setRecos([...preferred, ...fallback].slice(0, 3));
    });

    return unsubscribe;
  }, []);

  const handleAddReco = (product) => {
    eventBus.emit(EVENTS.CART_ITEM_ADDED, {
      product,
      source: 'recommendations',
    });
  };

  return (
    <div className="recommendations">
      <h2>Les joueurs achetent aussi</h2>
      <div className="reco-list">
        {recos.map(p => (
          <div key={p.id} className="reco-card" onClick={() => handleAddReco(p)}>
            <div className="reco-image" data-category={p.category}>{p.category}</div>
            <span className="reco-name">{p.name}</span>
            <span className="reco-price">{p.price} EUR</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
