import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../services/products'
import ProductModal from '../components/ProductModal'
import ProductDetailModal from '../components/ProductDetailModal'

function DosPorUno() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    // Productos específicos para 2x1 según las imágenes
    const productos2x1 = [
      {
        id: 1,
        nombre: "Bermuda Jean",
        precio: 4500, // Precio normal del products.json
        imagen: "/img/ropa-nino/bermuda.png",
        categoria: "ninos",
        es2x1: true,
        precioOriginal: 4500
      },
      {
        id: 2,
        nombre: "Pantalón Cargo",
        precio: 8900, // Ya coincide con products.json
        imagen: "/img/ropa-nino/pantalon cargo.png",
        categoria: "ninos",
        es2x1: true,
        precioOriginal: 8900
      },
      {
        id: 3,
        nombre: "Pollera Recta",
        precio: 10500, // Precio normal del products.json
        imagen: "/img/ropa-nina/pollera-recta-photoroom.png",
        categoria: "ninas",
        es2x1: true,
        precioOriginal: 10500
      },
      {
        id: 4,
        nombre: "Vincha",
        precio: 7000, // Precio normal del products.json
        imagen: "/img/accesorios/vincha.png",
        categoria: "accesorios",
        es2x1: true,
        precioOriginal: 7000
      }
    ]
    
    if (mounted) {
      setProducts(productos2x1)
      setLoading(false)
    }
    return () => (mounted = false)
  }, [])

  const handleAddToCart = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleShowDetails = (product) => {
    setSelectedDetailProduct(product)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedDetailProduct(null)
  }

  return (
    <>
      {/* 1. CARTEL ARRIBA */}
      <div className="liquidacion-header">
        <div className="liquidacion-banner">
          <h2>💥 Ofertas 2x1!</h2>
          <p className="liquidacion-subtitle">Llevá dos prendas y pagá solo una. ¡Las mejores ofertas para vestir a tus pequeños!</p>
        </div>
      </div>

    <main className="dos-por-uno">
      
      {/* 2. PRODUCTOS CENTRO */}
      {loading && <p>Cargando promociones...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div className="galeria galeria-2x1">
          {products.map((p) => (
            <div key={p.id} className="producto liquidacion-item">
              {p.imagen && <img src={p.imagen} alt={p.nombre} />}
              <h3>{p.nombre}</h3>
              <p className="precio-original">${p.precioOriginal.toLocaleString()}</p>
              <p className="precio-oferta">2 x ${p.precio.toLocaleString()}</p>
              <div className="product-buttons">
                <button className="boton-detalles" onClick={() => handleShowDetails(p)}>
                  Más Detalles
                </button>
                <button className="boton-carrito" onClick={() => handleAddToCart(p)}>
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 3. CONDICIONES DE LA PROMOCIÓN ABAJO */}
      <div className="liquidacion-info">
        <div className="info-card">
          <i className="fas fa-info"></i>
          <h3>Condiciones de la promoción</h3>
          <ul>
            <li>Válido hasta agotar stock</li>
            <li>Productos seleccionados</li>
            <li>No acumulable con otras promociones</li>
          </ul>
        </div>
      </div>
      
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      
      <ProductDetailModal
        product={selectedDetailProduct}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </main>
    
    <div className="volver-inicio-footer">
      <Link to="/" className="volver-inicio-btn">🏠 Volver al inicio</Link>
    </div>
    </>
  )
}

export default DosPorUno