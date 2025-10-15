import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useState } from 'react'

function Navbar() {
  const { totalItems } = useCart()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navegar a la página de productos con el término de búsqueda
      window.location.href = `/productos?search=${encodeURIComponent(searchTerm.trim())}`
    }
  }

  return (
    <nav>
      <ul className="menu">
        <li>
          <a>🧥 ¡Explorá más!</a>
          <ul className="submenu">
            <li><Link to="/ninas">Ropa de Niñas</Link></li>
            <li><Link to="/ninos">Ropa de Niños</Link></li>
            <li><Link to="/bebe">Ropa de Bebé</Link></li>
            <li><Link to="/accesorios">Accesorios</Link></li>
          </ul>
        </li>
        <li>
          <a>💥 Ofertas</a>
          <ul className="submenu">
            <li><Link to="/2x1">2x1</Link></li>
            <li><Link to="/liquidaciones">Liquidaciones</Link></li>
          </ul>
        </li>
        <li>
          <a>📞 Contactanos</a>
          <ul className="submenu">
            <li><Link to="/whatsapp">WhatsApp</Link></li>
            <li><Link to="/contacto">Email</Link></li>
          </ul>
        </li>
        <li><Link to="/ubicacion">📍 ¿Dónde estamos?</Link></li>
        <li className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        </li>
        <li style={{marginLeft: '10px'}}>
          <div className="carrito-header">
            <Link to="/carrito" className="carrito-link">
              <i className="fas fa-shopping-cart"></i>
              <span id="contador-carrito" className="contador-carrito">{totalItems}</span>
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar