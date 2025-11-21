import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaSearch, FaShoppingCart, FaTimes } from 'react-icons/fa'
import ProductModal from '../components/ProductModal'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'

function Productos() {
  const { products, loading, error } = useProducts()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

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
    setCurrentPage(1) // Resetear a la primera página cuando cambian los filtros
  }, [products, searchTerm, selectedCategory, priceRange])

  // Calcular productos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage])

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

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

  const categories = useMemo(
    () => [...new Set((products || []).map(p => p.categoria))].filter(Boolean),
    [products]
  )

  return (
    <>
      <Helmet>
        <title>Productos - Facherit@s | Catálogo Completo de Ropa Infantil</title>
        <meta name="description" content="Explorá nuestro catálogo completo de ropa infantil. Encontrá prendas para niñas, niños y bebés con los mejores precios y calidad." />
        <meta name="keywords" content="productos infantiles, catálogo ropa niños, ropa infantil online, Facherit@s productos" />
      </Helmet>
    <main>
      {/* Filtros de búsqueda */}
      <div className="filters-container">
        <div className="search-filters">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FaSearch style={{ position: 'absolute', left: '10px', color: '#8a2be2' }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-filter"
              style={{ paddingLeft: '35px' }}
              aria-label="Buscar productos"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#8a2be2' }}
                aria-label="Limpiar búsqueda"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
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
          
          <button onClick={clearFilters} className="clear-filters-btn" aria-label="Limpiar todos los filtros">
            <FaTimes style={{ marginRight: '5px' }} />
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
        <>
          <div className="galeria">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <div key={p.id} className="producto">
                  {p.imagen && <img src={p.imagen} alt={p.nombre} />}
                  <h3>{p.nombre}</h3>
                  <p className="precio">${p.precio}</p>
                  <button 
                    className="boton-carrito" 
                    onClick={() => handleAddToCart(p)}
                    aria-label={`Agregar ${p.nombre} al carrito`}
                  >
                    <FaShoppingCart style={{ marginRight: '5px' }} />
                    Agregar al carrito
                  </button>
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
          
          {/* Paginación */}
          {totalPages > 1 && (
            <nav aria-label="Navegación de páginas" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
              <ul className="pagination" style={{ display: 'flex', listStyle: 'none', gap: '5px', padding: 0 }}>
                <li>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Ir a página ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          )}
          
          {totalPages > 1 && (
            <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
              Página {currentPage} de {totalPages} ({filteredProducts.length} productos)
            </p>
          )}
        </>
      )}
      
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
    </>
  )
}

export default Productos


