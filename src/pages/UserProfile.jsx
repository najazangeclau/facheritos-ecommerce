import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function UserProfile() {
  const { user, logout } = useAuth()
  const { items, totalPrice, clear } = useCart()
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    // Cargar historial de compras desde localStorage
    const history = JSON.parse(localStorage.getItem(`purchase_history_${user?.id}`) || '[]')
    setPurchaseHistory(history)
  }, [user])

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
      logout()
    }
  }

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
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
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
            onClick={() => setActiveTab('cart')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              background: activeTab === 'cart' ? '#8a2be2' : 'transparent',
              color: activeTab === 'cart' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            🛒 Carrito Actual ({items.length})
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
            📦 Historial
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div style={{ padding: '30px' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>
                📋 Información del Perfil
              </h2>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong>👤 Nombre:</strong> {user?.name}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>📧 Email:</strong> {user?.email}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>🎭 Rol:</strong> {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </div>
                <div>
                  <strong>📅 Miembro desde:</strong> {formatDate(user?.createdAt || new Date())}
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          )}

          {activeTab === 'cart' && (
            <div>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>
                🛒 Carrito Actual
              </h2>
              {items.length > 0 ? (
                <div>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>📦 Productos en el carrito:</strong> {items.length}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>💰 Total:</strong> ${totalPrice}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => window.location.href = '/carrito'}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#8a2be2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🛒 Ver Carrito
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
                          clear()
                        }
                      }}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🗑️ Vaciar Carrito
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                  <h3>Tu carrito está vacío</h3>
                  <p>¡Agregá algunos productos para comenzar a comprar!</p>
                  <button
                    onClick={() => window.location.href = '/productos'}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#8a2be2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginTop: '15px'
                    }}
                  >
                    🛍️ Ir a Productos
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>
                📦 Historial de Compras
              </h2>
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
                        <strong>📦 Productos:</strong> {purchase.items.length}
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
