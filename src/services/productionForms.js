// Servicio para producción con EmailJS + localStorage como backup

import { emailService } from './emailService'
import { contactosLocalService, comprasLocalService } from './localStorage'

// ===== SERVICIO HÍBRIDO PARA PRODUCCIÓN =====
export const productionService = {
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
      message: emailResult.success 
        ? 'Mensaje enviado correctamente. Te responderemos pronto.' 
        : 'Mensaje guardado. Te contactaremos pronto.'
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
      message: emailResult.success 
        ? 'Compra procesada correctamente. Te contactaremos pronto.' 
        : 'Compra registrada. Te contactaremos pronto.'
    }
  }
}

// ===== CONFIGURACIÓN EMAILJS =====
export const emailConfig = {
  // Pasos para configurar EmailJS:
  // 1. Ve a https://www.emailjs.com/
  // 2. Crea una cuenta gratuita
  // 3. Crea un servicio de email (Gmail, Outlook, etc.)
  // 4. Crea templates para contacto y compra
  // 5. Reemplaza estos valores:
  
  serviceId: 'YOUR_SERVICE_ID',        // Ej: 'service_abc123'
  templateContactId: 'YOUR_TEMPLATE_ID', // Ej: 'template_contact'
  templateCompraId: 'YOUR_TEMPLATE_ID',  // Ej: 'template_compra'
  publicKey: 'YOUR_PUBLIC_KEY'         // Ej: 'user_xyz789'
}

// ===== TEMPLATES DE EMAIL =====
export const emailTemplates = {
  // Template para contacto
  contacto: `
    Nuevo mensaje de contacto desde Facheritos:
    
    Nombre: {{from_name}}
    Email: {{from_email}}
    Teléfono: {{phone}}
    Motivo: {{motivo}}
    Mensaje: {{message}}
    
    Fecha: {{date}}
  `,
  
  // Template para compra
  compra: `
    Nueva compra desde Facheritos:
    
    Cliente: {{from_name}}
    Email: {{from_email}}
    Teléfono: {{phone}}
    Dirección: {{address}}
    Ciudad: {{city}}
    Código Postal: {{postal_code}}
    Método de Pago: {{payment_method}}
    
    Carrito:
    {{cart_items}}
    
    Total: ${{total_amount}}
    
    Fecha: {{date}}
  `
}


