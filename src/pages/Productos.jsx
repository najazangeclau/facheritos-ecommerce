import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../services/products'
import ProductModal from '../components/ProductModal'
import { useSearchParams } from 'react-router-dom'

function Productos() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchProducts()
      .then((data) => {
        if (mounted) {
          setProducts(data)
          setFilteredProducts(data)
          setError(null)
        }
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  // Efecto para manejar búsqueda desde URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Función para normalizar texto (quitar acentos)
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  // Efecto para filtrar productos
  useEffect(() => {
    let filtered = [...products]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const normalizedSearchTerm = normalizeText(searchTerm)
      filtered = filtered.filter(product =>
        normalizeText(product.nombre).includes(normalizedSearchTerm) ||
        (product.descripcion && normalizeText(product.descripcion).includes(normalizedSearchTerm))
      )
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory)
    }

    // Filtrar por rango de precio
    if (priceRange.min) {
      filtered = filtered.filter(product => product.precio >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.precio <= parseInt(priceRange.max))
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, priceRange])

  const handleAddToCart = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
  }

  const categories = [...new Set(products.map(p => p.categoria))].filter(Boolean)

  return (
    <main>
      {/* Filtros de búsqueda */}
      <div className="filters-container">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-filter"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <div className="price-filters">
            <input
              type="number"
              placeholder="Precio mínimo"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Precio máximo"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="price-input"
            />
          </div>
          
          <button onClick={clearFilters} className="clear-filters-btn">
            Limpiar filtros
          </button>
        </div>
        
        <div className="results-info">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <div className="galeria">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} className="producto">
                {p.imagen && <img src={p.imagen} alt={p.nombre} />}
                <h3>{p.nombre}</h3>
                <p className="precio">${p.precio}</p>
                <button className="boton-carrito" onClick={() => handleAddToCart(p)}>Agregar al carrito</button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron productos con los filtros aplicados.</p>
              <button onClick={clearFilters} className="boton-carrito">
                Ver todos los productos
              </button>
            </div>
          )}
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

export default Productos


