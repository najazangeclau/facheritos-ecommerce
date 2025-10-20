import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const { totalItems } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [submenuStates, setSubmenuStates] = useState({explorar: false, ofertas: false, contacto: false})

  const toggleSubmenu = (key) => {
    setSubmenuStates(prev => {
      const newStates = {explorar: false, ofertas: false, contacto: false}
      newStates[key] = !prev[key]
      return newStates
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navegar a la página de productos con el término de búsqueda
      window.location.href = `/productos?search=${encodeURIComponent(searchTerm.trim())}`
    }
  }

  return (
    <nav>
      <div className="nav-top-bar">
        <button
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="search-container">
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
        </div>
        <Link to="/carrito" className="cart-link">
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </Link>
      </div>
      <ul className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
        <li className="has-submenu">
          <a onClick={() => toggleSubmenu('explorar')} className="menu-item">
            🧥 ¡Explorá más!
            <span className={`arrow ${submenuStates.explorar ? 'rotated' : ''}`}>▶</span>
          </a>
          <ul className={`submenu ${submenuStates.explorar ? 'submenu-open' : ''}`}>
            <li><Link to="/ninas" onClick={() => setIsMenuOpen(false)}>Ropa de Niñas</Link></li>
            <li><Link to="/ninos" onClick={() => setIsMenuOpen(false)}>Ropa de Niños</Link></li>
            <li><Link to="/bebe" onClick={() => setIsMenuOpen(false)}>Ropa de Bebé</Link></li>
            <li><Link to="/accesorios" onClick={() => setIsMenuOpen(false)}>Accesorios</Link></li>
          </ul>
        </li>
        <li className="has-submenu">
          <a onClick={() => toggleSubmenu('ofertas')} className="menu-item">
            💥 Ofertas
            <span className={`arrow ${submenuStates.ofertas ? 'rotated' : ''}`}>▶</span>
          </a>
          <ul className={`submenu ${submenuStates.ofertas ? 'submenu-open' : ''}`}>
            <li><Link to="/2x1" onClick={() => setIsMenuOpen(false)}>2x1</Link></li>
            <li><Link to="/liquidaciones" onClick={() => setIsMenuOpen(false)}>Liquidaciones</Link></li>
          </ul>
        </li>
        <li className="has-submenu">
          <a onClick={() => toggleSubmenu('contacto')} className="menu-item">
            📞 Contactanos
            <span className={`arrow ${submenuStates.contacto ? 'rotated' : ''}`}>▶</span>
          </a>
          <ul className={`submenu ${submenuStates.contacto ? 'submenu-open' : ''}`}>
            <li><Link to="/whatsapp" onClick={() => setIsMenuOpen(false)}>WhatsApp</Link></li>
            <li><Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Email</Link></li>
          </ul>
        </li>
        <li><Link to="/ubicacion" onClick={() => setIsMenuOpen(false)}>📍 ¿Dónde estamos?</Link></li>
        
        {/* Opciones de autenticación */}
        {isAuthenticated() ? (
          <>
            <li>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'darkblue',
                fontWeight: '600',
                padding: '12px 15px',
                transition: 'color 0.3s, transform 0.2s',
                fontSize: '16px',
                whiteSpace: 'nowrap'
              }}>
                {user?.name}
              </Link>
            </li>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault()
                  if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
                    logout()
                    setIsMenuOpen(false)
                  }
                }}
                style={{
                  display: 'block',
                  padding: '12px 15px',
                  textDecoration: 'none',
                  color: 'darkblue',
                  fontWeight: '600',
                  transition: 'color 0.3s, transform 0.2s',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = 'violet'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.color = 'darkblue'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                🚪 Salir
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <span style={{ fontSize: '14px' }}>🔐</span> Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <span style={{ fontSize: '14px' }}>📝</span> Registro
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar