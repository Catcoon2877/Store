import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { loginSuccess } from "../store/authSlice";
import { AppDispatch } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import styles from "./Register.module.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Обновляем профиль пользователя с именем
      await updateProfile(user, { displayName: name });

      // Авторизуем пользователя
      dispatch(loginSuccess(user));
      navigate("/"); // Перенаправляем на главную страницу
    } catch (error: any) {
      let errorMessage = "Ошибка при регистрации.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Пользователь с таким email уже существует.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Пароль слишком слабый.";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerForm} onSubmit={handleRegister}>
        <h2>Регистрация</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Зарегистрироваться</button>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;