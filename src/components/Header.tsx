import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FaSignOutAlt } from "react-icons/fa"; // Иконка выхода
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/cart">Корзина</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.userSection}>
        {user ? (
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user.displayName || user.email}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FaSignOutAlt /> Выйти
            </button>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.loginButton}>
              Войти
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;