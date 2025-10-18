import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Limpiar error al escribir
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Error inesperado. Intentá nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#8a2be2',
            fontSize: '28px',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            🔐 Iniciar Sesión
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Ingresá a tu cuenta de Facherit@s
          </p>
        </div>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
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
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8a2be2'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              🔑 Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8a2be2'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isLoading ? '#ccc' : '#8a2be2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#7b1fa2'
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#8a2be2'
            }}
          >
            {isLoading ? '🔄 Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            ¿No tenés cuenta?
          </p>
          <Link
            to="/register"
            style={{
              color: '#8a2be2',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            📝 Crear cuenta nueva
          </Link>
        </div>

      </div>
    </main>
  )
}

export default Login

