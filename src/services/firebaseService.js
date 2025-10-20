// Servicio de Firebase para manejar datos en la nube (deshabilitado temporalmente)
// import { 
//   collection, 
//   doc, 
//   addDoc, 
//   getDocs, 
//   updateDoc, 
//   deleteDoc, 
//   query, 
//   where,
//   orderBy,
//   serverTimestamp 
// } from 'firebase/firestore'
// import { db } from '../config/firebase'

// ===== SERVICIO DE USUARIOS (deshabilitado temporalmente) =====
export const usersService = {
  // Crear usuario
  async createUser(userData) {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente' }
  },

  // Obtener usuario por email
  async getUserByEmail(email) {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente' }
  },

  // Actualizar usuario
  async updateUser(userId, userData) {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente' }
  }
}

// ===== SERVICIO DE COMPRAS (deshabilitado temporalmente) =====
export const purchasesService = {
  // Crear compra
  async createPurchase(purchaseData) {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente' }
  },

  // Obtener compras por usuario
  async getPurchasesByUser(userId) {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente', purchases: [] }
  },

  // Obtener todas las compras (para admin)
  async getAllPurchases() {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente', purchases: [] }
  }
}

// ===== SERVICIO DE CONTACTOS (deshabilitado temporalmente) =====
export const contactsService = {
  // Crear contacto
  async createContact(contactData) {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente' }
  },

  // Obtener todos los contactos (para admin)
  async getAllContacts() {
    console.log('⚠️ Firebase deshabilitado - usando localStorage')
    return { success: false, error: 'Firebase deshabilitado temporalmente', contacts: [] }
  }
}

