import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Header() {
  const [shrink, setShrink] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShrink(window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={shrink ? 'shrink-logo' : ''}>
      <div className="logo-container">
        <Link to="/">
          <img src="/img/logo.png" alt="Logo de Facherit@s" />
        </Link>
        <div className="subtitulo-logo">El look perfecto para cada aventura</div>
      </div>
    </header>
  )
}

export default Header


