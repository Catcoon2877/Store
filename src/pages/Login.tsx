import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import { AppDispatch } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Валидация email
    if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный email.");
      return;
    }

    // Валидация пароля
    if (!validatePassword(password)) {
      setError("Пароль должен содержать минимум 6 символов, одну цифру и один специальный символ.");
      return;
    }

    dispatch(loginStart());
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(loginSuccess(userCredential.user));
      navigate("/"); // Перенаправляем на главную страницу
    } catch (error: any) {
      let errorMessage = "Ошибка при входе.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Пользователь не найден.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Неверный пароль.";
      }
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2>Вход</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;