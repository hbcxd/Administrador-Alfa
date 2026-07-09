import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Estas son las credenciales de la base de datos de tu propio Panel Maestro
const firebaseConfig = {
  apiKey: "AIzaSyAP79oeDD4d6stMPXwMToQhQQTEneb6iww",
  authDomain: "base-de-datos-maestra-5a5a7.firebaseapp.com",
  projectId: "base-de-datos-maestra-5a5a7",
  storageBucket: "base-de-datos-maestra-5a5a7.firebasestorage.app",
  messagingSenderId: "998538522792",
  appId: "1:998538522792:web:b80a0239fcc749282b929d",
  measurementId: "G-TTVVXRQR37"
};

// Inicializamos la app maestra
const masterApp = initializeApp(masterFirebaseConfig, "master-panel-root");

// Exportamos la base de datos de la nube para usarla en el contexto
export const db = getFirestore(masterApp);
