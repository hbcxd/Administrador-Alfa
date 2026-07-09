import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Estas son las credenciales de la base de datos de tu propio Panel Maestro
const masterFirebaseConfig = {
  apiKey: "TU_MASTER_API_KEY",
  authDomain: "TU_MASTER_AUTH_DOMAIN",
  projectId: "TU_MASTER_PROJECT_ID",
  storageBucket: "TU_MASTER_STORAGE_BUCKET",
  messagingSenderId: "TU_MASTER_MESSAGING_SENDER_ID",
  appId: "TU_MASTER_APP_ID"
};

// Inicializamos la app maestra
const masterApp = initializeApp(masterFirebaseConfig, "master-panel-root");

// Exportamos la base de datos de la nube para usarla en el contexto
export const db = getFirestore(masterApp);
