import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

function ForgotPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', newPassword: '', confirmPassword: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Completá todos los campos')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsSubmitting(true)
    const result = await resetPassword(formData.email, formData.newPassword)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('¡Contraseña actualizada! Ahora podés iniciar sesión.')
      navigate('/login')
    } else {
      toast.error(result.error || 'No pudimos restablecer la contraseña')
    }
  }

  return (
    <>
      <Helmet>
        <title>Recuperar contraseña - Facherit@s</title>
        <meta name="description" content="Recuperá el acceso a tu cuenta de Facherit@s actualizando tu contraseña." />
      </Helmet>
      <main
        style={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '40px',
            width: '100%',
            maxWidth: '420px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#8a2be2', fontSize: '26px', marginBottom: '10px', fontWeight: '700' }}>
              🔐 Recuperar contraseña
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Ingresá tu email y elegí una nueva contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
              🔑 Nueva contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
              🔁 Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                marginBottom: '25px'
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: isSubmitting ? '#ccc' : '#8a2be2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '20px'
              }}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#8a2be2', fontWeight: 600 }}>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default ForgotPassword

