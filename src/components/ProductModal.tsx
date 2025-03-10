import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "../store/cartSlice";
import { RootState } from "../store/store";
import styles from "./ProductModal.module.css";

interface ProductModalProps {
  product: {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
  };
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleIncreaseQuantity = () => {
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(product.id));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={product.image} alt={product.title} className={styles.modalImage} />
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Цена: ${product.price}</p>
        {quantity === 0 ? (
          <button onClick={handleAddToCart} className={styles.cartButton}>
            Добавить в корзину
          </button>
        ) : (
          <div className={styles.quantityControls}>
            <button onClick={handleDecreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncreaseQuantity}>+</button>
          </div>
        )}
        <button onClick={onClose} className={styles.closeButton}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ProductModal;