import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: '#8a2be2'
      }}>
        🔄 Verificando acceso...
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si requiere rol específico y no lo tiene
  if (requiredRole && requiredRole === 'admin' && !isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
          🚫 Acceso Denegado
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          No tenés permisos para acceder a esta página.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8a2be2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Volver
        </button>
      </div>
    )
  }

  // Si todo está bien, mostrar el componente
  return children
}

export default ProtectedRoute

