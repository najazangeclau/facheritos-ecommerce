import React, { useState, useEffect } from 'react'

function CartNotification({ isVisible, product, onClose }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      console.log('Mostrando notificación para:', product?.nombre)
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300) // Esperar a que termine la animación
      }, 3000) // Mostrar por 3 segundos
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, product])

  if (!isVisible && !show) return null

  return (
    <div className={`cart-notification ${show ? 'show' : 'hide'}`}>
      <div className="cart-notification-content">
        <div className="cart-notification-icon">
          🛒
        </div>
        <div className="cart-notification-text">
          <h4>¡Producto agregado!</h4>
          <p>{product?.nombre || 'Producto'}</p>
        </div>
        <button 
          className="cart-notification-close"
          onClick={() => {
            setShow(false)
            setTimeout(onClose, 300)
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default CartNotification