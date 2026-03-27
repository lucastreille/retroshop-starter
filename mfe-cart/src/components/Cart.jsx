import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import { EVENTS } from 'shared/events';
import './Cart.css';

let nextCartItemId = 1;

function Cart() {
  const [items, setItems] = useState([]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.CART_ITEM_ADDED, ({ product }) => {
      setItems(prev => [
        ...prev,
        {
          ...product,
          cartId: `cart-item-${nextCartItemId++}`,
        },
      ]);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    eventBus.emit(EVENTS.CART_UPDATED, {
      items,
      count: items.length,
      total,
    });
  }, [items]);

  const handleRemove = (cartId) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClear = () => {
    setItems([]);
  };

  return (
    <div className="cart">
      <h2>Panier ({items.length})</h2>
      {items.length === 0 ? (
        <p className="empty">Panier vide</p>
      ) : (
        <>
          <ul className="cart-items">
            {items.map(item => (
              <li key={item.cartId} className="cart-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{item.price} EUR</span>
                <button className="remove-btn" onClick={() => handleRemove(item.cartId)}>x</button>
              </li>
            ))}
          </ul>
          <div className="cart-footer">
            <div className="cart-total">Total : {total} EUR</div>
            <button className="clear-btn" onClick={handleClear}>Vider le panier</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
