import { useState, useEffect } from 'react'
import { contactosService, comprasService, reviewsService } from '../services/forms'
import { localUtils } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('contactos')
  const [contactos, setContactos] = useState([])
  const [compras, setCompras] = useState([])
  const [reviews, setReviews] = useState([])
  
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setContactos(contactosService.obtenerContactos())
    setCompras(comprasService.obtenerCompras())
    
    // Cargar reseñas de MockAPI.io (asíncrono)
    try {
      const reviewsData = await reviewsService.obtenerReviews()
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error cargando reseñas:', error)
      setReviews([])
    }
  }

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
      logout()
    }
  }

  const eliminarContacto = (id) => {
    if (confirm('¿Estás seguro de que querés eliminar este contacto?')) {
      contactosService.eliminarContacto(id)
      loadData()
    }
  }

  const eliminarCompra = (id) => {
    if (confirm('¿Estás seguro de que querés eliminar esta compra?')) {
      comprasService.eliminarCompra(id)
      loadData()
    }
  }

  const eliminarReview = async (id) => {
    if (confirm('¿Estás seguro de que querés eliminar esta reseña?')) {
      try {
        const success = await reviewsService.eliminarReview(id)
        if (success) {
          alert('Reseña eliminada correctamente')
          loadData() // Recargar datos
        } else {
          alert('Error al eliminar la reseña')
        }
      } catch (error) {
        console.error('Error eliminando reseña:', error)
        alert('Error al eliminar la reseña')
      }
    }
  }

  const exportarDatos = () => {
    localUtils.exportarDatos()
  }

  const limpiarDatos = () => {
    if (confirm('¿Estás seguro de que querés eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      localUtils.limpiarTodosLosDatos()
      loadData()
    }
  }

  // El componente ya no necesita verificar autenticación aquí
  // porque ProtectedRoute se encarga de eso

  return (
    <main className="admin-panel">
      <div className="admin-header">
        <h1>📊 Panel de Administración</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>
            👋 Hola, {user?.name}
          </span>
          <div className="admin-actions">
            <button onClick={exportarDatos} className="btn-export">
              📥 Exportar Datos
            </button>
            <button onClick={limpiarDatos} className="btn-clear">
              🗑️ Limpiar Todo
            </button>
            <button onClick={handleLogout} className="btn-logout">
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'contactos' ? 'active' : ''}
          onClick={() => setActiveTab('contactos')}
        >
          📧 Contactos ({contactos.length})
        </button>
        <button 
          className={activeTab === 'compras' ? 'active' : ''}
          onClick={() => setActiveTab('compras')}
        >
          🛒 Compras ({compras.length})
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reseñas ({reviews.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'contactos' && (
          <div className="admin-section">
            <h2>📧 Contactos</h2>
            {contactos.length === 0 ? (
              <p>No hay contactos registrados</p>
            ) : (
              <div className="admin-list">
                {contactos.map((contacto) => (
                  <div key={contacto.id} className="admin-item">
                    <div className="item-content">
                      <h3>{contacto.nombre}</h3>
                      <p><strong>Email:</strong> {contacto.email}</p>
                      <p><strong>Teléfono:</strong> {contacto.telefono}</p>
                      <p><strong>Mensaje:</strong> {contacto.mensaje}</p>
                      <p><strong>Fecha:</strong> {new Date(contacto.date).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => eliminarContacto(contacto.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'compras' && (
          <div className="admin-section">
            <h2>🛒 Compras</h2>
            {compras.length === 0 ? (
              <p>No hay compras registradas</p>
            ) : (
              <div className="admin-list">
                {compras.map((compra) => (
                  <div key={compra.id} className="admin-item">
                    <div className="item-content">
                      <h3>{compra.nombre} {compra.apellido}</h3>
                      <p><strong>Email:</strong> {compra.email}</p>
                      <p><strong>Teléfono:</strong> {compra.telefono}</p>
                      <p><strong>Dirección:</strong> {compra.direccion}, {compra.ciudad}</p>
                      <p><strong>Total:</strong> ${compra.total}</p>
                      <p><strong>Fecha:</strong> {new Date(compra.date).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => eliminarCompra(compra.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="admin-section">
            <h2>⭐ Reseñas</h2>
            {reviews.length === 0 ? (
              <p>No hay reseñas registradas</p>
            ) : (
              <div className="admin-list">
                {reviews.map((review) => (
                  <div key={review.ID || review.id} className="admin-item">
                    <div className="item-content">
                      <h3>{review.name}</h3>
                      <p><strong>Calificación:</strong> {'⭐'.repeat(review.rating)}</p>
                      <p><strong>Comentario:</strong> {review.comment}</p>
                      <p><strong>Producto:</strong> {review.product}</p>
                      <p><strong>Talle:</strong> {review.talle}</p>
                      <p><strong>Fecha:</strong> {new Date(review.date).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => eliminarReview(review.ID || review.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminPanel

