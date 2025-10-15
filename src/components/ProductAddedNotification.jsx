import { useEffect, useState } from 'react'

function ProductAddedNotification({ isVisible, productName, onClose }) {
  const [show, setShow] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      setShow(true)
      
      const hideTimer = setTimeout(() => {
        setShow(false)
      }, 2500)
      
      const removeTimer = setTimeout(() => {
        setShouldRender(false)
        if (typeof onClose === 'function') {
          onClose()
        }
      }, 3000)
      
      return () => {
        clearTimeout(hideTimer)
        clearTimeout(removeTimer)
      }
    }
  }, [isVisible, onClose])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      setShouldRender(false)
      if (typeof onClose === 'function') {
        onClose()
      }
    }, 300)
  }
  
  if (!shouldRender) return null

  return (
    <div 
      className={`product-added-notification ${show ? 'show' : ''}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #e07bb7 0%, #e7b6d2 100%)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(224, 123, 183, 0.3)',
        zIndex: 9999,
        transform: show ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '1.5rem' }}>
          🛒
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
            ¡Producto agregado!
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {productName || 'Producto'} se agregó al carrito
          </p>
        </div>
        <button 
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: 0,
            marginLeft: 'auto'
          }}
          onClick={handleClose}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ProductAddedNotification
