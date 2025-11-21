import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaSave, FaTimes, FaDownload, FaSignOutAlt } from 'react-icons/fa'
import { contactosService, comprasService, reviewsService } from '../services/forms'
import { localUtils } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductContext'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('contactos')
  const [contactos, setContactos] = useState([])
  const [compras, setCompras] = useState([])
  const [reviews, setReviews] = useState([])
  const [productForm, setProductForm] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    imagen: '',
    descripcion: ''
  })
  const [editingProductId, setEditingProductId] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  
  const { user, logout } = useAuth()
  const {
    products,
    loading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts()

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

  const handleProductInputChange = (event) => {
    const { name, value } = event.target
    setProductForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const resetProductForm = () => {
    setProductForm({
      nombre: '',
      precio: '',
      categoria: '',
      imagen: '',
      descripcion: ''
    })
    setEditingProductId(null)
  }

  const handleEditProduct = (product) => {
    setProductForm({
      nombre: product.nombre || '',
      precio: product.precio || '',
      categoria: product.categoria || '',
      imagen: product.imagen || '',
      descripcion: product.descripcion || ''
    })
    setEditingProductId(product.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    setProductMessage(null)
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productForm)
        toast.success('Producto actualizado correctamente.')
      } else {
        await createProduct(productForm)
        toast.success('Producto agregado al catálogo.')
      }
      resetProductForm()
    } catch (error) {
      toast.error(error.message || 'Error guardando el producto.')
    }
  }

  const handleDeleteProduct = (product) => {
    setDeletingProduct(product)
  }

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return
    try {
      await deleteProduct(deletingProduct.id)
      toast.success('Producto eliminado correctamente.')
    } catch (error) {
      toast.error(error.message || 'Error eliminando el producto.')
    } finally {
      setDeletingProduct(null)
    }
  }

  const cancelDeleteProduct = () => {
    setDeletingProduct(null)
  }

  const categoryOptions = ['ninas', 'ninos', 'bebe', 'accesorios', 'ofertas']

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
    if (window.confirm('¿Estás seguro de que querés eliminar esta reseña?')) {
      try {
        const success = await reviewsService.eliminarReview(id)
        if (success) {
          toast.success('Reseña eliminada correctamente')
          loadData() // Recargar datos
        } else {
          toast.error('Error al eliminar la reseña')
        }
      } catch (error) {
        console.error('Error eliminando reseña:', error)
        toast.error('Error al eliminar la reseña')
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
    <>
      <Helmet>
        <title>Panel de Administración - Facherit@s</title>
        <meta name="description" content="Panel de administración para gestionar productos, contactos, compras y reseñas de Facherit@s." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <main className="admin-panel">
      <div className="admin-header">
        <h1>📊 Panel de Administración</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>
            👋 Hola, {user?.name}
          </span>
          <div className="admin-actions">
            <button onClick={exportarDatos} className="btn-export" aria-label="Exportar datos">
              <FaDownload style={{ marginRight: '5px' }} />
              Exportar Datos
            </button>
            <button onClick={limpiarDatos} className="btn-clear" aria-label="Limpiar todos los datos">
              <FaTrash style={{ marginRight: '5px' }} />
              Limpiar Todo
            </button>
            <button onClick={handleLogout} className="btn-logout" aria-label="Cerrar sesión">
              <FaSignOutAlt style={{ marginRight: '5px' }} />
              Salir
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
        <button 
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
        >
          🛍️ Productos ({products.length})
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

        {activeTab === 'productos' && (
          <div className="admin-section">
            <h2>🛍️ Catálogo de productos</h2>
            
            <div className="product-form-card">
              <h3>{editingProductId ? 'Editar producto' : 'Agregar producto'}</h3>
              <form className="product-form" onSubmit={handleProductSubmit}>
                <div className="form-row">
                  <label>
                    Nombre*
                    <input 
                      type="text"
                      name="nombre"
                      value={productForm.nombre}
                      onChange={handleProductInputChange}
                      required
                    />
                  </label>
                  <label>
                    Precio*
                    <input 
                      type="number"
                      min="1"
                      name="precio"
                      value={productForm.precio}
                      onChange={handleProductInputChange}
                      required
                    />
                  </label>
                  <label>
                    Categoría*
                    <select
                      name="categoria"
                      value={productForm.categoria}
                      onChange={handleProductInputChange}
                      required
                    >
                      <option value="">Seleccioná</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Imagen (URL)
                    <input 
                      type="text"
                      name="imagen"
                      value={productForm.imagen}
                      onChange={handleProductInputChange}
                      placeholder="https://..."
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Descripción*
                    <textarea
                      name="descripcion"
                      minLength={10}
                      value={productForm.descripcion}
                      onChange={handleProductInputChange}
                      required
                    />
                  </label>
                </div>
                <div className="product-form-actions">
                  <button type="submit" className="btn-save" aria-label={editingProductId ? 'Guardar cambios' : 'Agregar producto'}>
                    <FaSave style={{ marginRight: '5px' }} />
                    {editingProductId ? 'Guardar cambios' : 'Agregar producto'}
                  </button>
                  {editingProductId && (
                    <button type="button" className="btn-cancel" onClick={resetProductForm} aria-label="Cancelar edición">
                      <FaTimes style={{ marginRight: '5px' }} />
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="product-list-card">
              <h3>Productos cargados</h3>
              {productsLoading && <p>Cargando productos...</p>}
              {productsError && <p style={{ color: 'red' }}>Error: {productsError}</p>}
              {!productsLoading && !productsError && products.length === 0 && (
                <p>No hay productos en el catálogo.</p>
              )}
              {!productsLoading && !productsError && products.length > 0 && (
                <div className="product-table-wrapper">
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.nombre}</td>
                          <td>{product.categoria}</td>
                          <td>${product.precio}</td>
                          <td style={{ maxWidth: '280px' }}>{product.descripcion || 'Sin descripción'}</td>
                          <td>
                            <div className="product-actions">
                              <button 
                                type="button"
                                className="btn-edit"
                                onClick={() => handleEditProduct(product)}
                                aria-label={`Editar ${product.nombre}`}
                              >
                                <FaEdit style={{ marginRight: '5px' }} />
                                Editar
                              </button>
                              <button 
                                type="button"
                                className="btn-delete"
                                onClick={() => handleDeleteProduct(product)}
                                aria-label={`Eliminar ${product.nombre}`}
                              >
                                <FaTrash style={{ marginRight: '5px' }} />
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>

    {deletingProduct && (
      <div 
        className="modal-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        <div 
          className="modal-content"
          style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
        >
          <h3>Confirmar eliminación</h3>
          <p>¿Querés eliminar <strong>{deletingProduct.nombre}</strong> del catálogo?</p>
          <div 
            className="modal-actions"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}
          >
            <button className="btn-cancel" onClick={cancelDeleteProduct} aria-label="Cancelar eliminación">
              <FaTimes style={{ marginRight: '5px' }} />
              Cancelar
            </button>
            <button className="btn-delete" onClick={confirmDeleteProduct} aria-label="Confirmar eliminación">
              <FaTrash style={{ marginRight: '5px' }} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default AdminPanel

