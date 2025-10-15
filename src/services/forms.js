// Servicio para manejar formularios (localStorage + MockAPI.io como fallback)

import { 
  contactosLocalService, 
  comprasLocalService, 
  reviewsLocalService 
} from './localStorage'

// URLs de MockAPI.io - Solo para reseñas (ya configurado)
const MOCKAPI_BASE_URL = 'https://68ee717fdf2025af7803b475.mockapi.io'
const REVIEWS_URL = `${MOCKAPI_BASE_URL}/reviews`

// ===== SERVICIO DE CONTACTOS =====
export const contactosService = {
  // Enviar formulario de contacto (localStorage)
  async enviarContacto(formData) {
    return await contactosLocalService.enviarContacto(formData)
  },

  // Obtener todos los contactos (para admin)
  obtenerContactos() {
    return contactosLocalService.obtenerContactos()
  },

  // Eliminar contacto (para admin)
  eliminarContacto(id) {
    return contactosLocalService.eliminarContacto(id)
  }
}

// ===== SERVICIO DE COMPRAS =====
export const comprasService = {
  // Enviar formulario de compra (localStorage)
  async enviarCompra(formData, carrito, total) {
    return await comprasLocalService.enviarCompra(formData, carrito, total)
  },

  // Obtener todas las compras (para admin)
  obtenerCompras() {
    return comprasLocalService.obtenerCompras()
  },

  // Eliminar compra (para admin)
  eliminarCompra(id) {
    return comprasLocalService.eliminarCompra(id)
  }
}

// ===== SERVICIO DE RESEÑAS =====
export const reviewsService = {
  // Enviar reseña
  async enviarReview(formData) {
    try {
      const response = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Reseña enviada:', result)
      return { success: true, data: result }
    } catch (error) {
      console.error('❌ Error enviando reseña:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todas las reseñas
  async obtenerReviews() {
    try {
      const response = await fetch(REVIEWS_URL)
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('❌ Error obteniendo reseñas:', error)
      return []
    }
  },

  // Eliminar reseña (para admin)
  async eliminarReview(id) {
    try {
      const response = await fetch(`${REVIEWS_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`)
        return false
      }
      
      console.log('✅ Reseña eliminada correctamente')
      return true
    } catch (error) {
      console.error('❌ Error eliminando reseña:', error)
      return false
    }
  }
}

// ===== UTILIDADES =====
export const formUtils = {
  // Validar email
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // Validar teléfono argentino
  validarTelefono(telefono) {
    const regex = /^(\+54|54)?[0-9]{10,11}$/
    return regex.test(telefono.replace(/\s/g, ''))
  },

  // Limpiar formulario
  limpiarFormulario(setFormData, camposIniciales) {
    setFormData(camposIniciales)
  },

  // Mostrar notificación
  mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div')
    notification.className = `notification notification-${tipo}`
    notification.textContent = mensaje
    
    // Estilos
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      ${tipo === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
    `
    
    // Agregar al DOM
    document.body.appendChild(notification)
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}
