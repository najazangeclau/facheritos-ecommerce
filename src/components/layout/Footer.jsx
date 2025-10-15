function Footer() {
  return (
    <footer>
      <hr />
      <div className="footer-content">
        <span className="footer-text">Desarrollador: Natalia - 2025</span>
        <span className="separator">|</span>
        <a href="mailto:facheritos@gmail.com" className="footer-link">
          <i className="fas fa-envelope"></i>
          facheritos@gmail.com
        </a>
        <span className="separator">|</span>
        <div className="social-links">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-link facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="social-link tiktok">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
      <hr />
    </footer>
  )
}

export default Footer



