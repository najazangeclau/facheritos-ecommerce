import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

function ProductDetailModal({ product, isOpen, onClose, showOffers = true }) {
  const { addItem } = useCart()
  const [selectedTalle, setSelectedTalle] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [cantidad, setCantidad] = useState(1)

  // Configuraciones de ofertas
  const PRODUCTOS_2X1_NAMES = ['Bermuda Jean', 'Pantalón Cargo', 'Pollera Recta', 'Vincha']
  const PRODUCTOS_LIQUIDACION_NAMES = ['Vestido Flores', 'Vestido Floreado', 'Jogging', 'Anteojo']

  // Función para validar ofertas
  const validateOffer = (product, talle, color) => {
    const isIn2x1List = PRODUCTOS_2X1_NAMES.includes(product.nombre)
    const isInLiquidacionList = PRODUCTOS_LIQUIDACION_NAMES.includes(product.nombre)
    
    if (!isIn2x1List && !isInLiquidacionList) {
      return { es2x1: false, esLiquidacion: false }
    }
    
    const offerConfigs = {
      'Vestido Flores': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
      'Vestido Floreado': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
      'Jogging': { talles: ['6', '10', '14'], colores: ['Azul', 'Negro', 'Gris'] },
      'Anteojo': { talles: ['Mediano'], colores: ['Negro', 'Azul', 'Rosa'] },
      'Bermuda Jean': { talles: ['4', '8', '12'], colores: ['Azul', 'Negro', 'Verde'] },
      'Pantalón Cargo': { talles: ['6', '10', '14'], colores: ['Beige', 'Verde', 'Negro'] },
      'Pollera Recta': { talles: ['4', '8', '12'], colores: ['Rosa', 'Azul', 'Blanco'] },
      'Vincha': { talles: ['Mediano'], colores: ['Rosa', 'Azul', 'Violeta'] }
    }
    
    const config = offerConfigs[product.nombre]
    if (!config) {
      return { es2x1: isIn2x1List, esLiquidacion: isInLiquidacionList }
    }
    
    const hasValidTalle = config.talles.includes(talle)
    const hasValidColor = config.colores.includes(color)
    const isValidOffer = hasValidTalle && hasValidColor
    
    return {
      es2x1: isValidOffer && isIn2x1List,
      esLiquidacion: isValidOffer && isInLiquidacionList
    }
  }

  // Función para obtener opciones disponibles
  const getAvailableOptions = () => {
    // Si showOffers es false (secciones generales), mostrar TODAS las opciones
    if (!showOffers) {
      return {
        talles: product.categoria === 'accesorios' 
          ? ['Chico', 'Mediano', 'Grande']
          : ['2', '4', '6', '8', '10', '12', '14', '16'],
        colores: ['Azul', 'Rosa', 'Blanco', 'Negro', 'Rojo', 'Verde', 'Amarillo', 'Violeta', 'Beige', 'Gris', 'Lila']
      }
    }
    
    // Si showOffers es true (secciones de ofertas), mostrar solo opciones de oferta
    const is2x1Product = PRODUCTOS_2X1_NAMES.includes(product.nombre)
    const isLiquidacionProduct = PRODUCTOS_LIQUIDACION_NAMES.includes(product.nombre)
    
    if (is2x1Product || isLiquidacionProduct) {
      const offerConfigs = {
        'Vestido Flores': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
        'Vestido Floreado': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
        'Jogging': { talles: ['6', '10', '14'], colores: ['Azul', 'Negro', 'Gris'] },
        'Anteojo': { talles: ['Mediano'], colores: ['Negro', 'Azul', 'Rosa'] },
        'Bermuda Jean': { talles: ['4', '8', '12'], colores: ['Azul', 'Negro', 'Verde'] },
        'Pantalón Cargo': { talles: ['6', '10', '14'], colores: ['Beige', 'Verde', 'Negro'] },
        'Pollera Recta': { talles: ['4', '8', '12'], colores: ['Rosa', 'Azul', 'Blanco'] },
        'Vincha': { talles: ['Mediano'], colores: ['Rosa', 'Azul', 'Violeta'] }
      }
      
      const config = offerConfigs[product.nombre]
      if (config) {
        return {
          talles: config.talles,
          colores: config.colores
        }
      }
    }
    
    // Opciones completas para productos normales
    return {
      talles: product.categoria === 'accesorios' 
        ? ['Chico', 'Mediano', 'Grande']
        : ['2', '4', '6', '8', '10', '12', '14', '16'],
      colores: ['Azul', 'Rosa', 'Blanco', 'Negro', 'Rojo', 'Verde', 'Amarillo', 'Violeta', 'Beige', 'Gris', 'Lila']
    }
  }

  // Establecer valores iniciales cuando se abre el modal
  useEffect(() => {
    if (product && isOpen) {
      const options = getAvailableOptions()
      setSelectedTalle(options.talles[0] || 'M')
      setSelectedColor(options.colores[0] || 'Azul')
      setCantidad(1)
    }
  }, [product, isOpen])

  const handleAddToCart = () => {
    if (product && selectedTalle && selectedColor) {
      addItem(product, {
        talle: selectedTalle,
        color: selectedColor,
        cantidad: cantidad
      })
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedTalle('')
    setSelectedColor('')
    setCantidad(1)
    onClose()
  }

  if (!isOpen || !product) return null

  const options = getAvailableOptions()
  const offerValidation = validateOffer(product, selectedTalle, selectedColor)
  
  // Calcular precio para liquidación (solo si showOffers es true)
  let precioFinal = product.precio
  let precioOriginal = product.precio
  
  if (showOffers && offerValidation.esLiquidacion) {
    switch (product.nombre) {
      case 'Vestido Flores':
      case 'Vestido Floreado':
        precioFinal = 3300
        precioOriginal = 11000
        break
      case 'Jogging':
        precioFinal = 4750
        precioOriginal = 9500
        break
      case 'Anteojo':
        precioFinal = 3000
        precioOriginal = 7500
        break
      default:
        precioFinal = product.precio
        precioOriginal = product.precio
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Producto</h2>
          <button className="modal-close-top-right" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.imagen && (
              <img src={product.imagen} alt={product.nombre} />
            )}
          </div>
          
          <div className="product-detail-info">
            <h3 className="product-detail-name">{product.nombre}</h3>
            
            <div className="product-detail-description">
              <h4>Descripción:</h4>
              <p>{product.descripcion || `${product.nombre.toLowerCase()}, producto de calidad para el uso diario.`}</p>
            </div>
            
            <div className="product-detail-price">
              <h4>Precio:</h4>
              <div className="price-container">
                {precioOriginal > precioFinal && (
                  <span className="precio-original">${precioOriginal}</span>
                )}
                <span className="precio-final">${precioFinal}</span>
              </div>
            </div>
            
            {showOffers && offerValidation.es2x1 && (
              <div className="offer-badge">
                <span className="badge-2x1">¡OFERTA 2x1!</span>
                <p>Lleva 2 y paga solo 1</p>
              </div>
            )}
            
            {showOffers && offerValidation.esLiquidacion && (
              <div className="offer-badge">
                <span className="badge-liquidacion">¡LIQUIDACIÓN!</span>
                <p>Precio especial por liquidación</p>
              </div>
            )}
            
            <div className="product-detail-options">
              <div className="option-group">
                <label htmlFor="talle-select">Talle:</label>
                <select
                  id="talle-select"
                  value={selectedTalle}
                  onChange={(e) => setSelectedTalle(e.target.value)}
                  className="detail-select"
                >
                  {options.talles.map(talle => (
                    <option key={talle} value={talle}>{talle}</option>
                  ))}
                </select>
              </div>
              
              <div className="option-group">
                <label htmlFor="color-select">Color:</label>
                <select
                  id="color-select"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="detail-select"
                >
                  {options.colores.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              
              <div className="option-group">
                <label htmlFor="cantidad-input">Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    id="cantidad-input"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                    className="quantity-input"
                  />
                  <button
                    type="button"
                    onClick={() => setCantidad(cantidad + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="product-detail-actions">
              <button
                className="btn-add-to-cart-detail"
                onClick={handleAddToCart}
              >
                Agregar al Carrito
              </button>
              <button
                className="btn-close-detail"
                onClick={handleClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
