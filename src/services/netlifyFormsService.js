// Servicio para usar Netlify Forms (el más simple)

// ===== SERVICIO NETLIFY FORMS =====
export const netlifyFormsService = {
  // Enviar formulario de contacto
  async enviarContacto(formData) {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('form-name', 'contacto')
      formDataToSend.append('nombre', formData.nombre)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('telefono', formData.telefono)
      formDataToSend.append('mensaje', formData.mensaje)
      formDataToSend.append('motivo', formData.motivo)

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSend).toString()
      })

      if (response.ok) {
        console.log('✅ Contacto enviado a Netlify Forms')
        return { success: true, message: 'Mensaje enviado correctamente. Te responderemos pronto.' }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ Error enviando contacto a Netlify Forms:', error)
      return { success: false, message: 'Error al enviar el mensaje. Intentalo nuevamente.' }
    }
  },

  // Enviar formulario de compra
  async enviarCompra(formData, carrito, total) {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('form-name', 'compra')
      formDataToSend.append('nombre', formData.nombre)
      formDataToSend.append('apellido', formData.apellido)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('telefono', formData.telefono)
      formDataToSend.append('direccion', formData.direccion)
      formDataToSend.append('ciudad', formData.ciudad)
      formDataToSend.append('codigoPostal', formData.codigoPostal)
      formDataToSend.append('metodoPago', formData.metodoPago)
      formDataToSend.append('carrito', JSON.stringify(carrito, null, 2))
      formDataToSend.append('total', total.toString())

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSend).toString()
      })

      if (response.ok) {
        console.log('✅ Compra enviada a Netlify Forms')
        return { success: true, message: 'Compra procesada correctamente. Te contactaremos pronto.' }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ Error enviando compra a Netlify Forms:', error)
      return { success: false, message: 'Error al procesar la compra. Intentalo nuevamente.' }
    }
  }
}

// ===== CONFIGURACIÓN PARA NETLIFY =====
// Para que funcione, necesitas agregar estos archivos a tu proyecto:

export const netlifyConfig = {
  // 1. Crear public/_redirects (para SPA)
  redirects: `
    /*    /index.html   200
  `,
  
  // 2. Crear public/forms/contacto.html (formulario estático)
  contactoForm: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Contacto - Facheritos</title>
    </head>
    <body>
      <form name="contacto" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contacto" />
        <div style="display: none;">
          <label>No llenes este campo: <input name="bot-field" /></label>
        </div>
        <p>
          <label>Nombre: <input type="text" name="nombre" /></label>
        </p>
        <p>
          <label>Email: <input type="email" name="email" /></label>
        </p>
        <p>
          <label>Teléfono: <input type="tel" name="telefono" /></label>
        </p>
        <p>
          <label>Mensaje: <textarea name="mensaje"></textarea></label>
        </p>
        <p>
          <button type="submit">Enviar</button>
        </p>
      </form>
    </body>
    </html>
  `,
  
  // 3. Crear public/forms/compra.html (formulario estático)
  compraForm: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Compra - Facheritos</title>
    </head>
    <body>
      <form name="compra" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="compra" />
        <div style="display: none;">
          <label>No llenes este campo: <input name="bot-field" /></label>
        </div>
        <p>
          <label>Nombre: <input type="text" name="nombre" /></label>
        </p>
        <p>
          <label>Apellido: <input type="text" name="apellido" /></label>
        </p>
        <p>
          <label>Email: <input type="email" name="email" /></label>
        </p>
        <p>
          <label>Teléfono: <input type="tel" name="telefono" /></label>
        </p>
        <p>
          <label>Dirección: <input type="text" name="direccion" /></label>
        </p>
        <p>
          <label>Ciudad: <input type="text" name="ciudad" /></label>
        </p>
        <p>
          <button type="submit">Enviar</button>
        </p>
      </form>
    </body>
    </html>
  `
}

