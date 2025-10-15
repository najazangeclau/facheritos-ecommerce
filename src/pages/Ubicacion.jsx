function Ubicacion() {
  return (
    <main>
      <div className="ubicacion-page-container">
        {/* Header Section */}
        <div className="ubicacion-header">
          <h1 className="ubicacion-main-title">¿Dónde encontrarnos?</h1>
          <p className="ubicacion-subtitle">
            ¡Visitá nuestra tienda física y descubrí toda nuestra colección!
          </p>
        </div>

        {/* Google Maps Section */}
        <div className="mapa-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.1234567890123!2d-58.45678901234567!3d-34.61234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca1234567890%3A0x1234567890abcdef!2sAv.%20Siempreviva%20742%2C%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
            width="100%"
            height="500"
            style={{ border: 0, borderRadius: '15px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Facherit@s"
          ></iframe>
        </div>

        {/* Contact Information Cards */}
        <div className="ubicacion-info-cards">
          <div className="ubicacion-info-card">
            <div className="ubicacion-info-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="ubicacion-info-text">
              <p>Av. Siempreviva 742, Buenos Aires</p>
            </div>
          </div>

          <div className="ubicacion-info-card">
            <div className="ubicacion-info-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="ubicacion-info-text">
              <p>Lunes a Sábados: 9:00 - 20:00</p>
            </div>
          </div>

          <div className="ubicacion-info-card">
            <div className="ubicacion-info-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="ubicacion-info-text">
              <p>Tel: (011) 4567-8900</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Ubicacion
