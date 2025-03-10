import React from "react";
import styles from "./CategorySidebar.module.css";

// Маппинг категорий
const categoryMapping: { [key: string]: string } = {
  "men's clothing": "Мужская одежда",
  "women's clothing": "Женская одежда",
  jewelery: "Ювелирные украшения",
  electronics: "Электроника",
};

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className={styles.sidebar}>
      <h3>Категории</h3>
      <ul>
        <li
          className={selectedCategory === "" ? styles.active : ""}
          onClick={() => onSelectCategory("")}
        >
          Все товары
        </li>
        {categories.map((category) => (
          <li
            key={category}
            className={selectedCategory === category ? styles.active : ""}
            onClick={() => onSelectCategory(category)}
          >
            {categoryMapping[category] || category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;