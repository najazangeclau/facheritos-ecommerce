import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductModal from '../components/ProductModal'
import ProductDetailModal from '../components/ProductDetailModal'
import { useProducts } from '../context/ProductContext'

function ProductosNino() {
  const { products, loading, error } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const productosNino = useMemo(
    () => products.filter((p) => String(p.categoria || '').toLowerCase() === 'ninos'),
    [products]
  )

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
    <main>
      <div className="page-description" style={{textAlign: 'center', width: '100%', margin: '0 auto 30px'}}>
        <p style={{textAlign: 'center', margin: '0 auto', padding: '20px', fontSize: '18px', color: '#333', lineHeight: '1.6'}}>Explorá nuestra línea de ropa para niños, perfecta para acompañar sus juegos, aventuras y momentos especiales con estilo y comodidad.</p>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <div className="galeria">
          {productosNino.length === 0 && (
            <p style={{ width: '100%', textAlign: 'center' }}>No hay productos disponibles para niños.</p>
          )}
          {productosNino.map((p) => (
            <div key={p.id} className="producto">
              {p.imagen && <img src={p.imagen} alt={p.nombre} />}
              <h3>{p.nombre}</h3>
              <p className="precio">${p.precio}</p>
              <div className="product-buttons">
                <button className="boton-detalles" onClick={() => handleShowDetails(p)}>
                  Más Detalles
                </button>
                <button className="boton-carrito" onClick={() => handleAddToCart(p)}>
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      
      <ProductDetailModal
        product={selectedDetailProduct}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        showOffers={false}
      />
    </main>
    
    <div className="volver-inicio-footer">
      <Link to="/" className="volver-inicio-btn">🏠 Volver al inicio</Link>
    </div>
    </>
  )
}

export default ProductosNino


