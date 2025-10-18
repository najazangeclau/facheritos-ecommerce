import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { purchasesService } from '../services/firebaseService'

function UserProfile() {
  const { user, logout } = useAuth()
  const { items, totalPrice, clear } = useCart()
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (user?.id) {
      // Cargar historial desde localStorage
      const history = JSON.parse(localStorage.getItem(`purchase_history_${user.id}`) || '[]')
      setPurchaseHistory(history)
    }
  }, [user])

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
      logout()
    }
  }

  // Función para refrescar el historial
  const refreshHistory = () => {
    if (user?.id) {
      // Cargar desde localStorage directamente
      const history = JSON.parse(localStorage.getItem(`purchase_history_${user.id}`) || '[]')
      setPurchaseHistory(history)
    }
  }

  // Escuchar cambios en localStorage para actualizar el historial
  useEffect(() => {
    const handleStorageChange = () => {
      refreshHistory()
    }

    window.addEventListener('storage', handleStorageChange)
    // También refrescar cuando se vuelve a la pestaña
    window.addEventListener('focus', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleStorageChange)
    }
  }, [user])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <main style={{
      minHeight: '80vh',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Header del perfil */}
        <div style={{
          background: 'linear-gradient(135deg, #8a2be2, #e07bb7)',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 auto 15px'
          }}>
            {user?.avatar}
          </div>
          <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>
            ¡Hola, {user?.name}! 👋
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
            {user?.email}
          </p>
        </div>

        {/* Tabs de navegación */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e9ecef'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              background: activeTab === 'profile' ? '#8a2be2' : 'transparent',
              color: activeTab === 'profile' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            👤 Mi Perfil
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              background: activeTab === 'history' ? '#8a2be2' : 'transparent',
              color: activeTab === 'history' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            📦 Historial de Compras
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div style={{ padding: '30px' }}>
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ 
                color: '#333', 
                marginBottom: '30px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                📋 Información del Perfil
              </h2>
              
              <div style={{
                background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '30px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                border: '1px solid #dee2e6'
              }}>
                <div style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <strong style={{ color: '#8a2be2', fontSize: '16px' }}>👤 Nombre:</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '18px', color: '#333' }}>{user?.name}</p>
                </div>
                
                <div style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <strong style={{ color: '#8a2be2', fontSize: '16px' }}>📧 Email:</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '18px', color: '#333' }}>{user?.email}</p>
                </div>
                
                <div style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <strong style={{ color: '#8a2be2', fontSize: '16px' }}>🎭 Rol:</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '18px', color: '#333' }}>
                    {user?.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                  </p>
                </div>
                
                <div style={{ 
                  padding: '15px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <strong style={{ color: '#8a2be2', fontSize: '16px' }}>📅 Miembro desde:</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '18px', color: '#333' }}>
                    {formatDate(user?.createdAt || new Date())}
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '15px 30px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#c82333'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#dc3545'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          )}


          {activeTab === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>
                  📦 Historial de Compras
                </h2>
                <button
                  onClick={refreshHistory}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#8a2be2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  🔄 Actualizar
                </button>
              </div>
              {purchaseHistory.length > 0 ? (
                <div>
                  {purchaseHistory.map((purchase, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <strong>📅 Fecha:</strong> {formatDate(purchase.date)}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>💰 Total:</strong> ${purchase.total}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>📦 Productos:</strong> {purchase.items?.length || purchase.carrito?.length || 0}
                      </div>
                      <div>
                        <strong>📧 Email:</strong> {purchase.email}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                  <h3>No hay compras registradas</h3>
                  <p>¡Hacé tu primera compra para verla aquí!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default UserProfile
