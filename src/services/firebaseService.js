// Servicio de Firebase para manejar datos en la nube
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// ===== SERVICIO DE USUARIOS =====
export const usersService = {
  // Crear usuario
  async createUser(userData) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log('✅ Usuario creado en Firebase:', docRef.id)
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('❌ Error creando usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener usuario por email
  async getUserByEmail(email) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        return { success: true, user: { id: doc.id, ...doc.data() } }
      } else {
        return { success: false, error: 'Usuario no encontrado' }
      }
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      })
      console.log('✅ Usuario actualizado en Firebase')
      return { success: true }
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error)
      return { success: false, error: error.message }
    }
  }
}

// ===== SERVICIO DE COMPRAS =====
export const purchasesService = {
  // Crear compra
  async createPurchase(purchaseData) {
    try {
      const docRef = await addDoc(collection(db, 'purchases'), {
        ...purchaseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log('✅ Compra creada en Firebase:', docRef.id)
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('❌ Error creando compra:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener compras por usuario
  async getPurchasesByUser(userId) {
    try {
      const q = query(
        collection(db, 'purchases'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      const purchases = []
      querySnapshot.forEach((doc) => {
        purchases.push({ id: doc.id, ...doc.data() })
      })
      
      return { success: true, purchases }
    } catch (error) {
      console.error('❌ Error obteniendo compras:', error)
      return { success: false, error: error.message, purchases: [] }
    }
  },

  // Obtener todas las compras (para admin)
  async getAllPurchases() {
    try {
      const q = query(collection(db, 'purchases'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const purchases = []
      querySnapshot.forEach((doc) => {
        purchases.push({ id: doc.id, ...doc.data() })
      })
      
      return { success: true, purchases }
    } catch (error) {
      console.error('❌ Error obteniendo todas las compras:', error)
      return { success: false, error: error.message, purchases: [] }
    }
  }
}

// ===== SERVICIO DE CONTACTOS =====
export const contactsService = {
  // Crear contacto
  async createContact(contactData) {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), {
        ...contactData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log('✅ Contacto creado en Firebase:', docRef.id)
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('❌ Error creando contacto:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todos los contactos (para admin)
  async getAllContacts() {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const contacts = []
      querySnapshot.forEach((doc) => {
        contacts.push({ id: doc.id, ...doc.data() })
      })
      
      return { success: true, contacts }
    } catch (error) {
      console.error('❌ Error obteniendo contactos:', error)
      return { success: false, error: error.message, contacts: [] }
    }
  }
}

