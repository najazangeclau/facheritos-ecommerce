import React from 'react'

function Badge({ children, type = 'descuento' }) {
  const badgeStyles = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: '#ff0000',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '1.2em',
    boxShadow: '0 4px 10px rgba(255,0,0,0.5)',
    zIndex: 99999,
    margin: 0,
    transform: 'none',
    border: '3px solid yellow',
    outline: 'none',
    display: 'block',
    minWidth: '50px',
    textAlign: 'center',
    lineHeight: '1.2'
  }

  return (
    <div style={badgeStyles}>
      {children}
    </div>
  )
}

export default Badge
