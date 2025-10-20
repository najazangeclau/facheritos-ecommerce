// Configuración de Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Configuración de Firebase (usando variables de entorno)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "facheritos-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "facheritos-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "facheritos-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
}

// Inicializar Firebase (deshabilitado temporalmente para evitar errores)
// const app = initializeApp(firebaseConfig)

// Inicializar servicios (deshabilitado temporalmente)
// export const db = getFirestore(app)
// export const auth = getAuth(app)

// export default app

