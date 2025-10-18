import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const { totalItems } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
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
        <li>
          <Link to="/carrito" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'darkblue',
            fontWeight: '600',
            padding: '12px 15px',
            transition: 'color 0.3s, transform 0.2s',
            fontSize: '16px',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '16px' }}>🛒</span>
            <span style={{
              background: '#8a2be2',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              minWidth: '18px',
              marginLeft: '4px'
            }}>
              {totalItems}
            </span>
          </Link>
        </li>
        
        {/* Opciones de autenticación */}
        {isAuthenticated() ? (
          <>
            <li>
              <Link to="/profile" style={{
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
              <Link to="/login" style={{
                textDecoration: 'none',
                color: 'darkblue',
                fontWeight: '600',
                padding: '8px 4px',
                transition: 'color 0.3s, transform 0.2s',
                fontSize: '10px',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}>
                <span style={{ fontSize: '14px' }}>🔐</span> Login
              </Link>
            </li>
            <li>
              <Link to="/register" style={{
                textDecoration: 'none',
                color: 'darkblue',
                fontWeight: '600',
                padding: '8px 4px',
                transition: 'color 0.3s, transform 0.2s',
                fontSize: '10px',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}>
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