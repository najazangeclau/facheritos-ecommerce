// Componente para usar Netlify Forms (más simple)

import { useState } from 'react'

function NetlifyForm({ type = 'contacto' }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target
    const formData = new FormData(form)

    try {
      // Netlify Forms automáticamente detecta formularios con name="contact"
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })

      if (response.ok) {
        setIsSubmitted(true)
        form.reset()
      } else {
        throw new Error('Error al enviar formulario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el formulario. Intentalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="form-success">
        <h3>¡Mensaje enviado correctamente!</h3>
        <p>Te responderemos pronto.</p>
        <button onClick={() => setIsSubmitted(false)}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form 
      name={type} 
      method="POST" 
      data-netlify="true" 
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="netlify-form"
    >
      {/* Campo oculto para Netlify */}
      <input type="hidden" name="form-name" value={type} />
      <div style={{ display: 'none' }}>
        <label>
          No llenes este campo: <input name="bot-field" />
        </label>
      </div>

      {type === 'contacto' && (
        <>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="5"
              required
            />
          </div>
        </>
      )}

      {type === 'compra' && (
        <>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ciudad">Ciudad:</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              required
            />
          </div>
        </>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-btn"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

export default NetlifyForm

