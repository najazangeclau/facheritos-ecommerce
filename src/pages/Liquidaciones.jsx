import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../services/products'
import ProductModal from '../components/ProductModal'
import Badge from '../components/Badge'

function Liquidaciones() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45
  })

  useEffect(() => {
    let mounted = true
    // Productos específicos para liquidaciones según las imágenes
    const productosLiquidacion = [
      {
        id: 1,
        nombre: "Vestido Floreado",
        precio: 3300, // 70% descuento de $11,000
        precioOriginal: 11000,
        imagen: "/img/ropa-nina/vestido-flores-photoroom.png",
        categoria: "ninas",
        descuento: 70,
        stock: "limitado"
      },
      {
        id: 2,
        nombre: "Jogging",
        precio: 4750, // 50% descuento de $9,500
        precioOriginal: 9500,
        imagen: "/img/ropa-nino/jogging.png",
        categoria: "ninos",
        descuento: 50,
        stock: 3
      },
      {
        id: 3,
        nombre: "Anteojo",
        precio: 3000, // 60% descuento de $7,500
        precioOriginal: 7500,
        imagen: "/img/accesorios/anteojo.png",
        categoria: "accesorios",
        descuento: 60,
        stock: "disponible"
      }
    ]
    
    if (mounted) {
      setProducts(productosLiquidacion)
      setLoading(false)
    }
    return () => (mounted = false)
  }, [])

  // Contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <>
      {/* 1. CARTEL ARRIBA */}
      <div className="liquidacion-header">
        <div className="liquidacion-banner">
          <h2>¡MEGA LIQUIDACIÓN!</h2>
          <p className="liquidacion-subtitle">Hasta 70% OFF en productos seleccionados</p>
        </div>
        
        <div className="countdown-container">
          <p>La liquidación termina en:</p>
          <div id="countdown">
            <div className="countdown-item">
              <span>{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="countdown-label">Días</span>
            </div>
            <div className="countdown-item">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="countdown-label">Horas</span>
            </div>
            <div className="countdown-item">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="countdown-label">Minutos</span>
            </div>
          </div>
        </div>
      </div>

    <main>
      
      {/* 2. PRODUCTOS CENTRO */}
      {loading && <p>Cargando liquidaciones...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div className="galeria">
          {products.map((p) => (
            <div key={p.id} className="producto liquidacion-item">
              <Badge type="descuento">-{p.descuento}%</Badge>
              {p.imagen && <img src={p.imagen} alt={p.nombre} />}
              <h3>{p.nombre}</h3>
              <p className="precio-original">${p.precioOriginal.toLocaleString()}</p>
              <p className="precio-liquidacion">${p.precio.toLocaleString()}</p>
              <div className="stock-info">
                <span className="stock-badge">
                  {typeof p.stock === 'number' 
                    ? `Quedan ${p.stock} unidades` 
                    : p.stock === 'limitado' 
                      ? '¡Stock limitado!' 
                      : 'Stock disponible'
                  }
                </span>
              </div>
              <button className="boton-comprar" onClick={() => handleAddToCart(p)}>
                🛒 Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. INFORMACIÓN IMPORTANTE ABAJO */}
      <div className="liquidacion-info">
        <div className="info-card">
          <i className="fas fa-info"></i>
          <h3>Información importante</h3>
          <ul>
            <li>Productos sujetos a disponibilidad de stock</li>
            <li>Los precios pueden variar sin previo aviso</li>
            <li>No se realizan cambios en productos en liquidación</li>
            <li>Promoción válida hasta agotar stock</li>
          </ul>
        </div>
      </div>
      
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
    
    <div className="volver-inicio-footer">
      <Link to="/" className="volver-inicio-btn">🏠 Volver al inicio</Link>
    </div>
    </>
  )
}

export default Liquidaciones
