import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Importar constantes de productos 2x1
const PRODUCTOS_2X1_NAMES = ['Bermuda Jean', 'Pantalón Cargo', 'Pollera Recta', 'Vincha']

function Carrito() {
  const { items, itemsWithPromo, removeItem, updateQuantity, updateTalle, updateColor, totalItems, totalPrice, clear } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [forceUpdate, setForceUpdate] = useState(0)
  
  // Forzar re-render cuando cambien los items
  useEffect(() => {
    setForceUpdate(prev => prev + 1)
  }, [itemsWithPromo])

  // Función para obtener opciones disponibles según el producto y si es 2x1
  const getAvailableOptions = (item) => {
    // Si es un producto 2x1, usar opciones limitadas
    if (item.es2x1) {
      const offerConfigs = {
        'Bermuda Jean': { talles: ['4', '8', '12'], colores: ['Azul', 'Negro', 'Verde'] },
        'Pantalón Cargo': { talles: ['6', '10', '14'], colores: ['Beige', 'Verde', 'Negro'] },
        'Pollera Recta': { talles: ['4', '8', '12'], colores: ['Rosa', 'Azul', 'Blanco'] },
        'Vincha': { talles: ['Mediano'], colores: ['Rosa', 'Azul', 'Violeta'] }
      }
      
      const config = offerConfigs[item.nombre]
      if (config) {
        return {
          talles: config.talles,
          colores: config.colores
        }
      }
    }
    
    // Si es liquidación, usar opciones limitadas
    if (item.esLiquidacion) {
      const offerConfigs = {
        'Vestido Flores': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
        'Vestido Floreado': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
        'Jogging': { talles: ['6', '10', '14'], colores: ['Azul', 'Negro', 'Gris'] },
        'Anteojo': { talles: ['Mediano'], colores: ['Negro', 'Azul', 'Rosa'] }
      }
      
      const config = offerConfigs[item.nombre]
      if (config) {
        return {
          talles: config.talles,
          colores: config.colores
        }
      }
    }
    
    // Opciones completas para productos normales
    return {
      talles: item.categoria === 'accesorios' 
        ? ['Chico', 'Mediano', 'Grande']
        : ['2', '4', '6', '8', '10', '12', '14', '16'],
      colores: ['Azul', 'Rosa', 'Blanco', 'Negro', 'Rojo', 'Verde', 'Amarillo', 'Violeta', 'Gris', 'Lila']
    }
  }

  // Función auxiliar para extraer la key original
  const getOriginalKey = (key) => {
    if (key.includes('-paid') || key.includes('-free')) {
      return key.split('-paid')[0].split('-free')[0]
    }
    return key
  }

  const getGroupTotalQuantity = (item) => {
    if (item.key.includes('-paid') || item.key.includes('-free')) {
      // Para items 2x1, contar todos los items del mismo producto
      const originalKey = getOriginalKey(item.key)
      const originalItem = items.find(i => i.key === originalKey)
      if (originalItem) {
        const groupItems = items.filter(i => i.nombre === originalItem.nombre)
        return groupItems.reduce((sum, i) => sum + i.quantity, 0)
      }
    }
    return item.quantity
  }

  // Función para obtener la cantidad total de un grupo de productos 2x1
  const getTotalQuantityFor2x1Group = (productName) => {
    const groupItems = items.filter(item => item.nombre === productName)
    return groupItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  // Función para obtener la cantidad total de un grupo normal (mismo producto + talle + color)
  const getTotalQuantityForNormalGroup = (productId, talle, color) => {
    const groupItems = items.filter(item => 
      item.id === productId && item.talle === talle && item.color === color
    )
    return groupItems.length
  }


  const handleQuantityChange = (key, newQuantity) => {
    const qty = parseInt(newQuantity) || 1
    const originalKey = getOriginalKey(key)
    
    console.log('🛒 CARRITO - ACTUALIZANDO CANTIDAD:')
    console.log('  - Key recibida:', key)
    console.log('  - Key original:', originalKey)
    console.log('  - Nueva cantidad:', qty)
    
    // Encontrar el item original para determinar si es 2x1
    const originalItem = items.find(item => item.key === originalKey)
    if (!originalItem) return
    
    const is2x1Product = PRODUCTOS_2X1_NAMES.includes(originalItem.nombre)
    
    if (is2x1Product) {
      // Para productos 2x1, contar todos los items del mismo producto (por nombre)
      const groupItems = items.filter(item => item.nombre === originalItem.nombre)
      const currentTotal = groupItems.reduce((sum, item) => sum + item.quantity, 0)
      
      console.log('  - Es producto 2x1:')
      console.log('    - Producto:', originalItem.nombre)
      console.log('    - Total actual del grupo:', currentTotal)
      console.log('    - Nueva cantidad solicitada:', qty)
      
      // Para productos 2x1, qty ya es la cantidad total deseada del grupo
      updateQuantity(originalKey, qty)
    } else {
      // Para productos normales, actualizar cantidad específica
      updateQuantity(originalKey, qty)
    }
  }

  const handleTalleChange = (key, newTalle) => {
    const originalKey = getOriginalKey(key)
    
    console.log('🛒 CARRITO - ACTUALIZANDO TALLE:')
    console.log('  - Key recibida:', key)
    console.log('  - Key original:', originalKey)
    console.log('  - Nuevo talle:', newTalle)
    
    // Para modificaciones independientes, usar la key específica del item
    updateTalle(key, newTalle)
  }

  const handleColorChange = (key, newColor) => {
    const originalKey = getOriginalKey(key)
    
    console.log('🛒 CARRITO - ACTUALIZANDO COLOR:')
    console.log('  - Key recibida:', key)
    console.log('  - Key original:', originalKey)
    console.log('  - Nuevo color:', newColor)
    
    // Para modificaciones independientes, usar la key específica del item
    updateColor(key, newColor)
  }

  const handlePagar = () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para continuar con la compra')
      navigate('/login')
      return
    }
    navigate('/formulario-compra')
  }

  const handleSeguirComprando = () => {
    navigate('/ninas')
  }

  return (
    <main className="carrito-page">
      <div className="carrito-container">
        <h1 className="carrito-title">Tu Carrito</h1>
        
        {itemsWithPromo.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="carrito-table-container">
            <table className="carrito-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Artículo</th>
                  <th>Color</th>
                  <th>Talle</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithPromo.map((item) => (
                  <tr key={item.key}>
                    <td className="carrito-image-cell">
                      {item.imagen && (
                        <img src={item.imagen} alt={item.nombre} className="carrito-product-image" />
                      )}
                    </td>
                    <td className="carrito-article-cell">
                      <div className="carrito-article-name">
                        {item.nombre}
                      </div>
                    </td>
                    <td className="carrito-color-cell">
                      <select 
                        value={item.color} 
                        onChange={(e) => {
                          handleColorChange(item.key, e.target.value)
                        }}
                        className="carrito-select"
                      >
                        {getAvailableOptions(item).colores.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="carrito-size-cell">
                      <select 
                        value={item.talle} 
                        onChange={(e) => {
                          handleTalleChange(item.key, e.target.value)
                        }}
                        className="carrito-select"
                      >
                        {getAvailableOptions(item).talles.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </td>
                    <td className="carrito-price-cell">
                      {item.esGratis ? (
                        <span className="gratis-price">GRATIS</span>
                      ) : (
                        <div className="price-container">
                          {item.precioOriginal && item.precioOriginal > item.precio && (
                            <span className="precio-original-carrito">${item.precioOriginal}</span>
                          )}
                          <span className="normal-price">${item.precio}</span>
                        </div>
                      )}
                    </td>
                    <td className="carrito-quantity-cell">
                      <div className="quantity-controls">
                        {(() => {
                          // Para productos 2x1, mostrar la cantidad total del grupo
                          // Para productos normales, mostrar la cantidad del item individual
                          const is2x1Product = PRODUCTOS_2X1_NAMES.includes(item.nombre)
                          const groupTotalQuantity = is2x1Product 
                            ? getTotalQuantityFor2x1Group(item.nombre)
                            : getTotalQuantityForNormalGroup(item.id, item.talle, item.color)
                          
                          return (
                            <>
                              <button 
                                className="quantity-btn"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (!item.esGratis && groupTotalQuantity > 1) {
                                    console.log('🔢 BOTÓN - CLICKEADO:')
                                    console.log('  - groupTotalQuantity actual:', groupTotalQuantity)
                                    console.log('  - Nueva cantidad a enviar:', groupTotalQuantity - 1)
                                    handleQuantityChange(item.key, groupTotalQuantity - 1)
                                  }
                                }}
                                disabled={groupTotalQuantity <= 1 || item.esGratis}
                              >
                                -
                              </button>
                    <div
                      contentEditable={!item.esGratis}
                      suppressContentEditableWarning={true}
                      onInput={(e) => {
                        const newQuantity = parseInt(e.target.textContent) || 1
                        // Agregar la cantidad de items que el usuario especifica
                        handleQuantityChange(item.key, newQuantity)
                      }}
                      className="quantity-input"
                      style={{
                        width: '50px',
                        height: '28px',
                        border: '2px solid #e7b6d2',
                        borderRadius: '6px',
                        padding: '4px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#8a2be2',
                        background: 'white',
                        outline: 'none',
                        cursor: item.esGratis ? 'not-allowed' : 'text',
                        opacity: item.esGratis ? 0.6 : 1
                      }}
                    >
                      1
                    </div>
                              <button 
                                className="quantity-btn"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (!item.esGratis) {
                                    console.log('🔢 BOTÓN + CLICKEADO:')
                                    console.log('  - groupTotalQuantity actual:', groupTotalQuantity)
                                    console.log('  - Nueva cantidad a enviar:', groupTotalQuantity + 1)
                                    handleQuantityChange(item.key, groupTotalQuantity + 1)
                                  }
                                }}
                                disabled={item.esGratis}
                              >
                                +
                              </button>
                            </>
                          )
                        })()}
                      </div>
                    </td>
                    <td className="carrito-subtotal-cell">
                      {item.esGratis ? (
                        <span className="gratis-subtotal">GRATIS</span>
                      ) : (
                        <span className="normal-subtotal">${item.precio}</span>
                      )}
                    </td>
                    <td className="carrito-delete-cell">
                      <button 
                        className="delete-btn"
                        onClick={() => removeItem(getOriginalKey(item.key))}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {itemsWithPromo.length > 0 && (
          <div className="carrito-footer">
            <div className="carrito-total">
              <span className="total-label">Total: ${totalPrice}</span>
            </div>
            
            <div className="carrito-actions">
              <button className="btn-vaciar" onClick={clear}>
                Vaciar carrito
              </button>
              <button className="btn-pagar" onClick={handlePagar}>
                Pagar
              </button>
              <button className="btn-seguir" onClick={handleSeguirComprando}>
                ← Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Carrito