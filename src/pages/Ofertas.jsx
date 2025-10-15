import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../services/products'
import ProductModal from '../components/ProductModal'

// Lista de nombres de productos 2x1 (misma que en CartContext)
const PRODUCTOS_2X1_NAMES = ['Bermuda Jean', 'Pantalón Cargo', 'Pollera Recta', 'Vincha']
const isProduct2x1 = (productName) => PRODUCTOS_2X1_NAMES.includes(productName)

function Ofertas() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    fetchProducts()
      .then((data) => {
        if (!mounted) return
        // Simular ofertas: productos con descuento del 20%
        const ofertas = data.map(p => ({
          ...p,
          precioOriginal: p.precio,
          precio: Math.round(p.precio * 0.8),
          descuento: 20
        }))
        setProducts(ofertas)
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false))
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

  return (
    <main>
      <div className="ofertas-header">
        <h2>🔥 Ofertas Especiales</h2>
        <p className="ofertas-descripcion">
          ¡No te pierdas estas increíbles ofertas! Productos seleccionados con descuentos especiales.
        </p>
      </div>
      
      {loading && <p>Cargando ofertas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div className="galeria">
          {products.map((p) => (
            <div key={p.id} className="producto liquidacion-item">
              {isProduct2x1(p.nombre) ? (
                <div className="descuento-badge">2x1</div>
              ) : (
                <div className="oferta-badge">-{p.descuento}%</div>
              )}
              {p.imagen && <img src={p.imagen} alt={p.nombre} />}
              <h3>{p.nombre}</h3>
              {!isProduct2x1(p.nombre) && <p className="precio-original">${p.precioOriginal}</p>}
              <p className="precio-oferta">${p.precio}</p>
              {isProduct2x1(p.nombre) ? (
                <p className="stock-info">
                  <span className="stock-badge">¡Lleva 2 y paga 1!</span>
                </p>
              ) : (
                <p className="stock-info">
                  <span className="stock-badge">¡Últimas unidades!</span>
                </p>
              )}
              <button className="boton-carrito" onClick={() => handleAddToCart(p)}>
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
      
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  )
}

export default Ofertas


