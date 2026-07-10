import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Línea incluida para la seguridad

// Tus credenciales reales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAP79oeDD4d6stMPXwMToQhQQTEneb6iww",
  authDomain: "base-de-datos-maestra-5a5a7.firebaseapp.com",
  projectId: "base-de-datos-maestra-5a5a7",
  storageBucket: "base-de-datos-maestra-5a5a7.firebasestorage.app",
  messagingSenderId: "998538522792",
  appId: "1:998538522792:web:b80a0239fcc749282b929d",
  measurementId: "G-TTVVXRQR37"
};

// Inicialización de la aplicación
const app = initializeApp(firebaseConfig);

// Exportación de los módulos para usarlos en todo el sistema
export const db = getFirestore(app);
export const auth = getAuth(app); // Línea incluida para el inicio de sesión
