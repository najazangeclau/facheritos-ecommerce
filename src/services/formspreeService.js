// Servicio para usar Formspree (más simple que EmailJS)

// ===== CONFIGURACIÓN FORMSPREE =====
// Pasos para configurar Formspree:
// 1. Ve a https://formspree.io/
// 2. Crea una cuenta gratuita
// 3. Crea un nuevo formulario
// 4. Copia el endpoint que te dan
// 5. Reemplaza 'YOUR_FORM_ID' con tu endpoint

// ENDPOINTS DE FORMSPREE CONFIGURADOS
const FORMSPREE_ENDPOINTS = {
  contacto: import.meta.env.VITE_FORMSPREE_CONTACTO || 'https://formspree.io/f/xqaywbjl',
  compra: import.meta.env.VITE_FORMSPREE_COMPRA || 'https://formspree.io/f/xyznljvn'
}

// ===== SERVICIO FORMSPREE =====
export const formspreeService = {
  // Enviar formulario de contacto
  async enviarContacto(formData) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINTS.contacto, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          mensaje: formData.mensaje,
          motivo: formData.motivo,
          _subject: 'Nuevo mensaje de contacto - Facheritos',
          _replyto: formData.email
        })
      })

      if (response.ok) {
        console.log('✅ Contacto enviado a Formspree')
        return { success: true, message: 'Mensaje enviado correctamente. Te responderemos pronto.' }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ Error enviando contacto a Formspree:', error)
      return { success: false, message: 'Error al enviar el mensaje. Intentalo nuevamente.' }
    }
  },

  // Enviar formulario de compra
  async enviarCompra(formData, carrito, total) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINTS.compra, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          metodoPago: formData.metodoPago,
          carrito: JSON.stringify(carrito, null, 2),
          total: total,
          _subject: 'Nueva compra - Facheritos',
          _replyto: formData.email
        })
      })

      if (response.ok) {
        console.log('✅ Compra enviada a Formspree')
        return { success: true, message: 'Compra procesada correctamente. Te contactaremos pronto.' }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ Error enviando compra a Formspree:', error)
      return { success: false, message: 'Error al procesar la compra. Intentalo nuevamente.' }
    }
  }
}

// ===== SERVICIO HÍBRIDO (Formspree + localStorage) =====
import { contactosLocalService, comprasLocalService } from './localStorage'

export const hybridFormspreeService = {
  // Enviar contacto (Formspree + backup local)
  async enviarContacto(formData) {
    // Intentar enviar a Formspree
    const formspreeResult = await formspreeService.enviarContacto(formData)
    
    // Siempre guardar localmente como backup
    const localResult = await contactosLocalService.enviarContacto(formData)
    
    return {
      success: formspreeResult.success || localResult.success,
      formspreeSent: formspreeResult.success,
      localBackup: localResult.success,
      message: formspreeResult.message
    }
  },

  // Enviar compra (Formspree + backup local)
  async enviarCompra(formData, carrito, total) {
    // Intentar enviar a Formspree
    const formspreeResult = await formspreeService.enviarCompra(formData, carrito, total)
    
    // Siempre guardar localmente como backup
    const localResult = await comprasLocalService.enviarCompra(formData, carrito, total)
    
    return {
      success: formspreeResult.success || localResult.success,
      formspreeSent: formspreeResult.success,
      localBackup: localResult.success,
      message: formspreeResult.message
    }
  }
}
