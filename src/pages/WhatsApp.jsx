function WhatsApp() {
  const sendWhatsApp = (number, message) => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${number}?text=${encodedMessage}`, '_blank')
  }

  return (
    <main>
      <div className="whatsapp-page-container">
        {/* Header Section */}
        <div className="whatsapp-header">
          <div className="whatsapp-icon-large">
            <i className="fab fa-whatsapp"></i>
          </div>
          <h1 className="whatsapp-main-title">Contactanos por WhatsApp</h1>
          <p className="whatsapp-subtitle">¡Chateá con nosotros y respondemos al instante!</p>
        </div>

        {/* Main Contact Cards */}
        <div className="whatsapp-contact-cards">
          <div className="whatsapp-contact-card">
            <div className="whatsapp-card-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <h3 className="whatsapp-card-title">Atención al cliente</h3>
            <p className="whatsapp-card-phone">+54 11 4567-8900</p>
            <p className="whatsapp-card-hours">
              <i className="fas fa-clock"></i>
              Lunes a Sábados: 9:00 - 20:00
            </p>
            <button 
              className="whatsapp-chat-button"
              onClick={() => sendWhatsApp("541145678900", "Hola! Me interesa consultar sobre productos de Facherit@s")}
            >
              <i className="fab fa-whatsapp"></i>
              Iniciar chat
            </button>
          </div>

          <div className="whatsapp-contact-card">
            <div className="whatsapp-card-icon">
              <i className="fas fa-store"></i>
            </div>
            <h3 className="whatsapp-card-title">Ventas mayoristas</h3>
            <p className="whatsapp-card-phone">+54 11 4567-8901</p>
            <p className="whatsapp-card-hours">
              <i className="fas fa-clock"></i>
              Lunes a Viernes: 9:00 - 18:00
            </p>
            <button 
              className="whatsapp-chat-button"
              onClick={() => sendWhatsApp("541145678901", "Hola! Me interesa información sobre ventas mayoristas")}
            >
              <i className="fab fa-whatsapp"></i>
              Iniciar chat
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="whatsapp-features">
          <div className="whatsapp-feature-card">
            <div className="whatsapp-feature-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <h4 className="whatsapp-feature-title">Respuesta rápida</h4>
            <p className="whatsapp-feature-desc">Te respondemos en minutos</p>
          </div>

          <div className="whatsapp-feature-card">
            <div className="whatsapp-feature-icon">
              <i className="fas fa-tag"></i>
            </div>
            <h4 className="whatsapp-feature-title">Ofertas exclusivas</h4>
            <p className="whatsapp-feature-desc">Recibí promociones especiales</p>
          </div>

          <div className="whatsapp-feature-card">
            <div className="whatsapp-feature-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h4 className="whatsapp-feature-title">Atención personalizada</h4>
            <p className="whatsapp-feature-desc">Resolvemos todas tus dudas</p>
          </div>
        </div>

        {/* Important Information */}
        <div className="whatsapp-info-card">
          <div className="whatsapp-info-header">
            <i className="fas fa-info-circle"></i>
            <h3 className="whatsapp-info-title">Información importante</h3>
          </div>
          <ul className="whatsapp-info-list">
            <li>Respondemos de lunes a sábado en horario comercial</li>
            <li>Fuera de horario, dejá tu mensaje y te contactaremos al siguiente día hábil</li>
            <li>Para una mejor atención, indicá el motivo de tu consulta</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default WhatsApp
