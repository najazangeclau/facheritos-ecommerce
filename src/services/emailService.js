// Servicio para enviar emails usando EmailJS (gratuito)

// ===== CONFIGURACIÓN EMAILJS =====
// Necesitas registrarte en https://www.emailjs.com/ (gratuito)
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',        // Reemplazar con tu Service ID
  templateId: 'YOUR_TEMPLATE_ID',      // Reemplazar con tu Template ID
  publicKey: 'YOUR_PUBLIC_KEY'         // Reemplazar con tu Public Key
}

// ===== SERVICIO DE EMAIL =====
export const emailService = {
  // Inicializar EmailJS
  async init() {
    try {
      // Cargar EmailJS dinámicamente
      if (!window.emailjs) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
        script.onload = () => {
          window.emailjs.init(EMAILJS_CONFIG.publicKey)
        }
        document.head.appendChild(script)
      }
      return true
    } catch (error) {
      console.error('❌ Error inicializando EmailJS:', error)
      return false
    }
  },

  // Enviar email de contacto
  async enviarContacto(formData) {
    try {
      await this.init()
      
      const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        phone: formData.telefono,
        message: formData.mensaje,
        motivo: formData.motivo,
        to_email: 'facheritos@gmail.com' // Tu email
      }

      const response = await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      )

      console.log('✅ Email de contacto enviado:', response)
      return { success: true, data: response }
    } catch (error) {
      console.error('❌ Error enviando email de contacto:', error)
      return { success: false, error: error.message }
    }
  },

  // Enviar email de compra
  async enviarCompra(formData, carrito, total) {
    try {
      await this.init()
      
      const templateParams = {
        from_name: `${formData.nombre} ${formData.apellido}`,
        from_email: formData.email,
        phone: formData.telefono,
        address: formData.direccion,
        city: formData.ciudad,
        postal_code: formData.codigoPostal,
        payment_method: formData.metodoPago,
        cart_items: JSON.stringify(carrito, null, 2),
        total_amount: total,
        to_email: 'facheritos@gmail.com' // Tu email
      }

      const response = await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        'template_compra', // Template específico para compras
        templateParams
      )

      console.log('✅ Email de compra enviado:', response)
      return { success: true, data: response }
    } catch (error) {
      console.error('❌ Error enviando email de compra:', error)
      return { success: false, error: error.message }
    }
  }
}

// ===== SERVICIO HÍBRIDO (Email + localStorage) =====
export const hybridService = {
  // Enviar contacto (email + backup local)
  async enviarContacto(formData) {
    // Intentar enviar email
    const emailResult = await emailService.enviarContacto(formData)
    
    // Siempre guardar localmente como backup
    const localResult = await contactosLocalService.enviarContacto(formData)
    
    return {
      success: emailResult.success || localResult.success,
      emailSent: emailResult.success,
      localBackup: localResult.success,
      data: emailResult.data || localResult.data
    }
  },

  // Enviar compra (email + backup local)
  async enviarCompra(formData, carrito, total) {
    // Intentar enviar email
    const emailResult = await emailService.enviarCompra(formData, carrito, total)
    
    // Siempre guardar localmente como backup
    const localResult = await comprasLocalService.enviarCompra(formData, carrito, total)
    
    return {
      success: emailResult.success || localResult.success,
      emailSent: emailResult.success,
      localBackup: localResult.success,
      data: emailResult.data || localResult.data
    }
  }
}




