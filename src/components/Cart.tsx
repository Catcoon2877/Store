import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { RootState } from "../store/store";
import styles from "./Cart.module.css";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className={styles.cartContainer}>
      <h2>Корзина</h2>
      {items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {items.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.title} className={styles.cartItemImage} />
                <div className={styles.cartItemDetails}>
                  <h3>{item.title}</h3>
                  <p>Цена: ${item.price}</p>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                    min="1"
                  />
                  <button onClick={() => handleRemoveFromCart(item.id)}>Удалить</button>
                </div>
              </li>
            ))}
          </ul>
          <p>Общая стоимость: ${totalPrice.toFixed(2)}</p>
          <button onClick={handleClearCart}>Очистить корзину</button>
          {user ? (
            <button className={styles.orderButton}>Заказать</button>
          ) : (
            <p className={styles.loginPrompt}>
              <Link to="/login">Войдите</Link>, чтобы оформить заказ.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;