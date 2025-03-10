import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "Yonlinestore-d63bf.firebaseapp.com",
  projectId: "onlinestore-d63bf",
  storageBucket: "onlinestore-d63bf.firebasestorage.app",
  messagingSenderId: "946827687217",
  appId: "1:946827687217:web:c69da56f76115b5c0d2c10",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);