import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// 1. AGREGUE ESTA LÍNEA (Importa el módulo de autenticación)
import { getAuth } from 'firebase/auth';

// Estas son sus credenciales actuales (deje las que usted ya tiene allá)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 2. ESTA LÍNEA YA DEBE ESTAR (Es la que conecta con la base de datos de sus páginas)
export const db = getFirestore(app);

// 3. AGREGUE ESTA LÍNEA AL FINAL (Inicializa y exporta el módulo de seguridad)
export const auth = getAuth(app);
