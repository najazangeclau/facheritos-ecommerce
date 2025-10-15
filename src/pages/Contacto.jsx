import { useState } from 'react'
import { contactosService, formUtils } from '../services/forms'
import { formspreeService } from '../services/formspreeService'

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    motivo: 'consulta'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar campos
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      formUtils.mostrarNotificacion('Por favor, completá todos los campos requeridos', 'error')
      return
    }

    if (!formUtils.validarEmail(formData.email)) {
      formUtils.mostrarNotificacion('Por favor, ingresá un email válido', 'error')
      return
    }

    // Enviar formulario a Formspree
    const resultado = await formspreeService.enviarContacto(formData)
    
    if (resultado.success) {
      formUtils.mostrarNotificacion(resultado.message, 'success')
      
      // También guardar localmente como backup
      await contactosService.enviarContacto(formData)
      
      // Limpiar formulario
      formUtils.limpiarFormulario(setFormData, {
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        motivo: 'consulta'
      })
    } else {
      formUtils.mostrarNotificacion(resultado.message, 'error')
    }
  }

  return (
    <main>
      <div className="contacto-container">
        <div className="contacto-form-card">
          <h1>Contactanos</h1>
          <p className="contacto-subtitle">
            ¿Tenés alguna pregunta o sugerencia? ¡Nos encantaría escucharte!
          </p>

          <form className="contacto-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingresá tu nombre"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingresá tu email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Tu mensaje:</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                value={formData.mensaje}
                onChange={handleInputChange}
                placeholder="Escribí aquí tu consulta"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="boton-enviar">
                Enviar mensaje
              </button>
              <button type="button" className="boton-limpiar" onClick={() => setFormData({
                nombre: '',
                email: '',
                telefono: '',
                mensaje: '',
                motivo: 'consulta'
              })}>
                Limpiar formulario
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Contacto




