import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { comprasService, formUtils } from '../services/forms'
import { formspreeService } from '../services/formspreeService'

function FormularioCompra() {
  const { items, itemsWithPromo, totalPrice, clear } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    metodoPago: 'transferencia',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: '',
    nombreTitular: '',
    comentarios: ''
  })

  // Pre-llenar formulario con datos del usuario si está logueado
  useEffect(() => {
    if (isAuthenticated() && user) {
      setFormData(prev => ({
        ...prev,
        nombre: user.name.split(' ')[0] || '',
        apellido: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        nombreTitular: user.name || ''
      }))
    }
  }, [user, isAuthenticated])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      formUtils.mostrarNotificacion('Por favor completá todos los campos obligatorios', 'error')
      return
    }

    if (!formUtils.validarEmail(formData.email)) {
      formUtils.mostrarNotificacion('Por favor, ingresá un email válido', 'error')
      return
    }

    if (!formUtils.validarTelefono(formData.telefono)) {
      formUtils.mostrarNotificacion('Por favor, ingresá un teléfono válido', 'error')
      return
    }

    // Enviar compra a Formspree
    const resultado = await formspreeService.enviarCompra(formData, itemsWithPromo, totalPrice)
    
    if (resultado.success) {
      formUtils.mostrarNotificacion(resultado.message, 'success')
      
      // También guardar localmente como backup
      await comprasService.enviarCompra(formData, itemsWithPromo, totalPrice, user?.id)
      
      // Mostrar cartel de confirmación
      setShowSuccess(true)
      
      // Limpiar carrito después de 3 segundos
      setTimeout(() => {
        clear()
        navigate('/')
      }, 3000)
    } else {
      formUtils.mostrarNotificacion(resultado.message, 'error')
    }
  }

  const handleVolver = () => {
    navigate('/carrito')
  }

  if (itemsWithPromo.length === 0) {
    return (
      <main>
        <div className="formulario-container">
          <h1>Tu carrito está vacío</h1>
          <p>Agrega productos antes de proceder al pago.</p>
          <button className="boton-carrito" onClick={() => navigate('/ninas')}>
            Ir a comprar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="formulario-container">
        <h1>Finalizar Compra</h1>
        
        {/* Resumen del pedido */}
        <div className="resumen-pedido">
          <h2>Resumen de tu pedido</h2>
          <div className="items-resumen">
            {itemsWithPromo.map((item) => (
              <div key={item.key} className="item-resumen">
                <span>{item.nombre}</span>
                <span>Talle: {item.talle} | Color: {item.color}</span>
                <span>Cantidad: 1</span>
                <span className={`precio-item ${item.esGratis ? 'gratis' : 'pago'}`}>
                  {item.esGratis ? 'GRATIS' : `$${item.precio}`}
                </span>
              </div>
            ))}
          </div>
          <div className="total-pedido">
            <strong>Total a pagar: ${totalPrice}</strong>
          </div>
        </div>

        {/* Formulario de datos */}
        <form onSubmit={handleSubmit} className="formulario-compra">
          <div className="seccion-formulario">
            <h3>Datos Personales</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="seccion-formulario">
            <h3>Dirección de Envío</h3>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Calle y número"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Código Postal</label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="seccion-formulario">
            <h3>Método de Pago</h3>
            <div className="form-group">
              <label>Selecciona método de pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivo">Efectivo (Contra entrega)</option>
              </select>
            </div>

          </div>

          <div className="seccion-formulario">
            <h3>Comentarios Adicionales</h3>
            <div className="form-group">
              <label>Comentarios (opcional)</label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={handleInputChange}
                rows="4"
                placeholder="Instrucciones especiales para la entrega, preferencias, etc."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-volver" onClick={handleVolver}>
              ← Volver al carrito
            </button>
            <button type="submit" className="btn-pagar">
              💳 Confirmar Compra - ${totalPrice}
            </button>
          </div>
        </form>
      </div>
      
      {/* Cartel de confirmación */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>¡Compra realizada con éxito!</h2>
            <p>Total pagado: <strong>${totalPrice}</strong></p>
            <p>Se enviará confirmación a: <strong>{formData.email}</strong></p>
            <p className="success-message">Redirigiendo al inicio...</p>
          </div>
        </div>
      )}
    </main>
  )
}

export default FormularioCompra

