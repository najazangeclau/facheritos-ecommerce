import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

function ProductModal({ product, isOpen, onClose }) {
  const { addItem } = useCart()
  const [talle, setTalle] = useState('6')
  const [color, setColor] = useState('Azul')
  const [cantidad, setCantidad] = useState(1)

  // Determinar talles según categoría del producto
  const isAccesorio = product?.categoria === 'accesorios'
  const isBebe = product?.categoria === 'bebe'
  
  // Verificar si es una oferta (liquidación o 2x1)
  const isOferta = product?.es2x1 || product?.descuento
  
  // Para ofertas, opciones específicas por producto
  let talles, colores
  
  if (isOferta) {
    // Configuraciones específicas por producto para ofertas
    switch (product.nombre) {
      case 'Vestido Flores': // Liquidación
      case 'Vestido Floreado': // Liquidación
        talles = ['4', '8', '12']
        colores = ['Rosa', 'Violeta', 'Blanco']
        break
      case 'Jogging': // Liquidación
        talles = ['6', '10', '14']
        colores = ['Azul', 'Negro', 'Gris']
        break
      case 'Anteojo': // Liquidación
        talles = ['Mediano']
        colores = ['Negro', 'Azul', 'Rosa']
        break
      case 'Bermuda Jean': // 2x1
        talles = ['4', '8', '12']
        colores = ['Azul', 'Negro', 'Verde']
        break
      case 'Pantalón Cargo': // 2x1
        talles = ['6', '10', '14']
        colores = ['Beige', 'Verde', 'Negro']
        break
      case 'Pollera Recta': // 2x1
        talles = ['4', '8', '12']
        colores = ['Rosa', 'Azul', 'Blanco']
        break
      case 'Vincha': // 2x1
        talles = ['Mediano']
        colores = ['Rosa', 'Azul', 'Violeta']
        break
      default:
        talles = isAccesorio ? ['Mediano'] : ['6', '10', '14']
        colores = ['Azul', 'Rosa', 'Negro']
    }
  } else {
    // Productos normales - opciones completas
    talles = isAccesorio 
      ? ['Chico', 'Mediano', 'Grande']
      : isBebe
      ? ['1 mes', '2 meses', '3 meses', '4 meses', '5 meses', '6 meses', '7 meses', '8 meses', '9 meses', '10 meses', '11 meses', '12 meses']
      : ['2', '4', '6', '8', '10', '12', '14', '16']
    
    colores = ['Azul', 'Rosa', 'Blanco', 'Negro', 'Rojo', 'Verde', 'Amarillo', 'Violeta', 'Beige', 'Gris', 'Lila']
  }

  // Establecer talle y color inicial según el tipo de producto
  useEffect(() => {
    if (product && isOpen) {
      if (isOferta) {
        // Para ofertas, usar el primer talle y color disponibles
        if (talles && talles.length > 0) {
          setTalle(talles[0])
        }
        if (colores && colores.length > 0) {
          setColor(colores[0])
        }
      } else if (isAccesorio) {
        setTalle('Mediano')
        setColor('Azul')
      } else if (isBebe) {
        setTalle('6 meses')
        setColor('Azul')
      } else {
        setTalle('6')
        setColor('Azul')
      }
    }
  }, [product, isOpen]) // Solo cuando cambia el producto o se abre el modal

  const handleAddToCart = () => {
    console.log('🛒 AGREGANDO DESDE MODAL:')
    console.log('  - Producto:', product.nombre)
    console.log('  - Talle seleccionado:', talle)
    console.log('  - Color seleccionado:', color)
    console.log('  - Cantidad:', cantidad)
    
    addItem(product, { talle, color, cantidad })
    onClose()
  }

  if (!isOpen || !product) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar al carrito</h3>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {product.imagen && (
            <img 
              src={product.imagen} 
              alt={product.nombre}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
          )}
          <h4>{product.nombre}</h4>
          <p className="precio">${product.precio}</p>
          {isOferta && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '10px',
              margin: '10px 0',
              fontSize: '0.9em',
              color: '#856404'
            }}>
              ⚠️ <strong>Oferta especial:</strong> Opciones limitadas de talles y colores
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            Talle: {isOferta && <span style={{color: '#e07bb7', fontSize: '0.8em'}}>(Opciones limitadas)</span>}
          </label>
          <select value={talle} onChange={(e) => setTalle(e.target.value)}>
            {talles.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            Color: {isOferta && <span style={{color: '#e07bb7', fontSize: '0.8em'}}>(Opciones limitadas)</span>}
          </label>
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colores.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            Cantidad:
          </label>
          <input
            type="number"
            min="1"
            max={10}
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="modal-buttons">
          <button className="boton-modal secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="boton-modal primary" onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
