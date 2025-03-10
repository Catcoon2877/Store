import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "../store/cartSlice";
import { RootState } from "../store/store";
import ProductModal from "../components/ProductModal";
import CategorySidebar from "../components/CategorySidebar";
import styles from "./Home.module.css";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);

        // Получаем уникальные категории
        const uniqueCategories = Array.from(new Set(data.map((product: Product) => product.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleIncreaseQuantity = (product: Product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    if (cartItem) {
      dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = (product: Product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity - 1 }));
      } else {
        dispatch(removeFromCart(product.id));
      }
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div className={styles.homeContainer}>
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <div className={styles.content}>
        <h1>Каталог</h1>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">По возрастанию цены</option>
            <option value="desc">По убыванию цены</option>
          </select>
        </div>
        <div className={styles.productsGrid}>
          {sortedProducts.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => handleProductClick(product)}
              >
                <img src={product.image} alt={product.title} className={styles.productImage} />
                <h2>{product.title}</h2>
                <p>{`${product.description.slice(0, 100)}...`}</p>
                <div className={styles.productFooter}>
                  <p>Цена: ${product.price}</p>
                  {quantity === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      Добавить в корзину
                    </button>
                  ) : (
                    <div className={styles.quantityControls}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecreaseQuantity(product);
                        }}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncreaseQuantity(product);
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Home;