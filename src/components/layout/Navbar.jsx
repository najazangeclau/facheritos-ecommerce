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
        <li style={{marginLeft: '10px'}}>
          <div className="carrito-header">
            <Link to="/carrito" className="carrito-link" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: 'darkblue',
              fontWeight: '600',
              padding: '8px 4px',
              transition: 'color 0.3s, transform 0.2s',
              fontSize: '10px',
              minHeight: '36px',
              justifyContent: 'center',
              width: '100%'
            }}>
              <span>🛒</span>
              <span id="contador-carrito" className="contador-carrito" style={{
                background: '#8a2be2',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            </Link>
          </div>
        </li>
        
        {/* Opciones de autenticación */}
        {isAuthenticated() ? (
          <>
            <li>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: 'darkblue',
                fontWeight: '600',
                padding: '8px 4px',
                transition: 'color 0.3s, transform 0.2s',
                fontSize: '10px',
                minHeight: '36px',
                justifyContent: 'center'
              }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#8a2be2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {user?.avatar}
                </span>
                <span style={{ display: window.innerWidth > 480 ? 'inline' : 'none' }}>
                  {user?.name}
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
                    logout()
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'darkblue',
                  fontWeight: '600',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  transition: 'color 0.3s, transform 0.2s',
                  fontSize: '10px',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
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
              </button>
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
                🔐 Login
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
                📝 Registro
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar