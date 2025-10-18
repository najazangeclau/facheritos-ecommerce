// Servicio para manejar formularios con localStorage

// ===== SERVICIO DE CONTACTOS =====
export const contactosLocalService = {
  // Enviar formulario de contacto
  async enviarContacto(formData) {
    try {
      const contacto = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString()
      }

      // Obtener contactos existentes
      const contactos = JSON.parse(localStorage.getItem('facheritos_contactos') || '[]')
      
      // Agregar nuevo contacto
      contactos.push(contacto)
      
      // Guardar en localStorage
      localStorage.setItem('facheritos_contactos', JSON.stringify(contactos))
      
      console.log('✅ Contacto guardado localmente:', contacto)
      return { success: true, data: contacto }
    } catch (error) {
      console.error('❌ Error guardando contacto:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todos los contactos
  obtenerContactos() {
    try {
      return JSON.parse(localStorage.getItem('facheritos_contactos') || '[]')
    } catch (error) {
      console.error('❌ Error obteniendo contactos:', error)
      return []
    }
  },

  // Eliminar contacto
  eliminarContacto(id) {
    try {
      const contactos = this.obtenerContactos()
      const contactosFiltrados = contactos.filter(contacto => contacto.id !== id)
      localStorage.setItem('facheritos_contactos', JSON.stringify(contactosFiltrados))
      return true
    } catch (error) {
      console.error('❌ Error eliminando contacto:', error)
      return false
    }
  }
}

// ===== SERVICIO DE COMPRAS =====
export const comprasLocalService = {
  // Enviar formulario de compra
  async enviarCompra(formData, carrito, total, userId = null) {
    try {
      const compra = {
        id: Date.now().toString(),
        ...formData,
        carrito: carrito,
        total: total,
        userId: userId, // Agregar ID del usuario
        date: new Date().toISOString()
      }

      // Obtener compras existentes
      const compras = JSON.parse(localStorage.getItem('facheritos_compras') || '[]')
      
      // Agregar nueva compra
      compras.push(compra)
      
      // Guardar en localStorage
      localStorage.setItem('facheritos_compras', JSON.stringify(compras))
      
      // Si hay usuario logueado, también guardar en su historial personal
      if (userId) {
        const userHistory = JSON.parse(localStorage.getItem(`purchase_history_${userId}`) || '[]')
        userHistory.push(compra)
        localStorage.setItem(`purchase_history_${userId}`, JSON.stringify(userHistory))
        console.log('✅ Compra guardada en historial del usuario:', userId, compra)
        console.log('📦 Historial actualizado:', userHistory)
      } else {
        console.log('⚠️ No hay userId, no se guarda en historial personal')
      }
      
      console.log('✅ Compra guardada localmente:', compra)
      return { success: true, data: compra }
    } catch (error) {
      console.error('❌ Error guardando compra:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todas las compras
  obtenerCompras() {
    try {
      return JSON.parse(localStorage.getItem('facheritos_compras') || '[]')
    } catch (error) {
      console.error('❌ Error obteniendo compras:', error)
      return []
    }
  },

  // Eliminar compra
  eliminarCompra(id) {
    try {
      const compras = this.obtenerCompras()
      const comprasFiltradas = compras.filter(compra => compra.id !== id)
      localStorage.setItem('facheritos_compras', JSON.stringify(comprasFiltradas))
      return true
    } catch (error) {
      console.error('❌ Error eliminando compra:', error)
      return false
    }
  }
}

// ===== SERVICIO DE RESEÑAS =====
export const reviewsLocalService = {
  // Enviar reseña
  async enviarReview(formData) {
    try {
      const review = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString()
      }

      // Obtener reseñas existentes
      const reviews = JSON.parse(localStorage.getItem('facheritos_reviews') || '[]')
      
      // Agregar nueva reseña
      reviews.push(review)
      
      // Guardar en localStorage
      localStorage.setItem('facheritos_reviews', JSON.stringify(reviews))
      
      console.log('✅ Reseña guardada localmente:', review)
      return { success: true, data: review }
    } catch (error) {
      console.error('❌ Error guardando reseña:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todas las reseñas
  obtenerReviews() {
    try {
      return JSON.parse(localStorage.getItem('facheritos_reviews') || '[]')
    } catch (error) {
      console.error('❌ Error obteniendo reseñas:', error)
      return []
    }
  },

  // Eliminar reseña
  eliminarReview(id) {
    try {
      const reviews = this.obtenerReviews()
      const reviewsFiltradas = reviews.filter(review => review.id !== id)
      localStorage.setItem('facheritos_reviews', JSON.stringify(reviewsFiltradas))
      return true
    } catch (error) {
      console.error('❌ Error eliminando reseña:', error)
      return false
    }
  }
}

// ===== UTILIDADES =====
export const localUtils = {
  // Limpiar todos los datos
  limpiarTodosLosDatos() {
    localStorage.removeItem('facheritos_contactos')
    localStorage.removeItem('facheritos_compras')
    localStorage.removeItem('facheritos_reviews')
    console.log('🗑️ Todos los datos locales eliminados')
  },

  // Exportar datos (para backup)
  exportarDatos() {
    const datos = {
      contactos: contactosLocalService.obtenerContactos(),
      compras: comprasLocalService.obtenerCompras(),
      reviews: reviewsLocalService.obtenerReviews(),
      fecha: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facheritos_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  // Importar datos
  importarDatos(archivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const datos = JSON.parse(e.target.result)
          
          if (datos.contactos) {
            localStorage.setItem('facheritos_contactos', JSON.stringify(datos.contactos))
          }
          if (datos.compras) {
            localStorage.setItem('facheritos_compras', JSON.stringify(datos.compras))
          }
          if (datos.reviews) {
            localStorage.setItem('facheritos_reviews', JSON.stringify(datos.reviews))
          }
          
          resolve({ success: true })
        } catch (error) {
          reject({ success: false, error: error.message })
        }
      }
      reader.readAsText(archivo)
    })
  }
}




