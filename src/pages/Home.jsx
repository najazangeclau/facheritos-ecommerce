import { useState, useEffect } from 'react'
import { reviewsService, formUtils } from '../services/forms'

function Home() {
  const [reviews, setReviews] = useState([])
  const [dynamicReviews, setDynamicReviews] = useState([])
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    comment: '',
    product: '',
    talle: ''
  })
  const [selectedStars, setSelectedStars] = useState(0)

  // Reseñas predeterminadas
  const defaultReviews = [
    {
      id: 1,
      name: 'María González',
      rating: 5,
      comment: '¡Las medias con dibujos son adorables! Mi hija está encantada con los unicornios y la calidad es excelente. No se deforman con los lavados.',
      product: 'Medias con dibujo - Talle: 21-23',
      date: '15 de marzo, 2025',
      avatar: 'M'
    },
    {
      id: 2,
      name: 'Laura Martínez',
      rating: 5,
      comment: 'La pollera amplia es perfecta para las fiestas escolares. El material es suave y la cintura elástica hace que sea muy cómoda. Mi hija la usa para todo.',
      product: 'Pollera con vuelo - Talle: 8',
      date: '10 de marzo, 2025',
      avatar: 'L'
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      rating: 4.5,
      comment: 'La pollera recta es ideal para el uniforme escolar. Excelente calidad y el ajuste es perfecto. La tela resiste muy bien el uso diario.',
      product: 'Pollera Clásica - Talle: 10',
      date: '5 de marzo, 2025',
      avatar: 'C'
    }
  ]

  // Cargar reseñas dinámicas desde MockAPI.io
  const loadDynamicReviews = async () => {
    try {
      const data = await reviewsService.obtenerReviews()
      console.log('📝 RESEÑAS CARGADAS DESDE MOCKAPI:', data)
      setDynamicReviews(data)
    } catch (error) {
      console.error('Error cargando reseñas desde MockAPI:', error)
    }
  }

  useEffect(() => {
    setReviews(defaultReviews)
    loadDynamicReviews()
  }, [])

  const handleStarClick = (rating) => {
    setSelectedStars(rating)
    setNewReview({...newReview, rating})
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!newReview.name || !newReview.comment || selectedStars === 0) {
      formUtils.mostrarNotificacion('Por favor, escribí tu reseña, tu nombre y seleccioná una calificación.', 'error')
      return
    }

    const reviewData = {
      name: newReview.name,
      comment: newReview.comment,
      rating: selectedStars,
      product: newReview.product || '',
      talle: newReview.talle || ''
    }

    console.log('📝 ENVIANDO RESEÑA:', reviewData)

    const resultado = await reviewsService.enviarReview(reviewData)
    
    if (resultado.success) {
      formUtils.mostrarNotificacion('¡Reseña enviada correctamente! Gracias por tu opinión.', 'success')
      
      setNewReview({ name: '', rating: 0, comment: '', product: '', talle: '' })
      setSelectedStars(0)
      loadDynamicReviews()
    } else {
      formUtils.mostrarNotificacion('No se pudo enviar la reseña. Intentalo más tarde.', 'error')
    }
  }

  const deleteReview = async (reviewId) => {
    console.log('🗑️ INICIANDO ELIMINACIÓN de reseña:', reviewId)
    const password = prompt('Contraseña de administrador para eliminar la reseña:')
    if (!password) {
      console.log('❌ Usuario canceló la eliminación')
      return
    }

    // Contraseña de administrador
    const ADMIN_PASSWORD = 'admin123'
    
    if (password !== ADMIN_PASSWORD) {
      console.log('❌ Contraseña incorrecta:', password)
      alert('Contraseña incorrecta')
      return
    }

    console.log('✅ Contraseña correcta, eliminando reseña...')

    const resultado = await reviewsService.eliminarReview(reviewId)
    
    if (resultado) {
      console.log('✅ Reseña eliminada correctamente')
      formUtils.mostrarNotificacion('Reseña eliminada correctamente', 'success')
      loadDynamicReviews()
    } else {
      console.error('❌ Error al eliminar la reseña')
      formUtils.mostrarNotificacion('Error al eliminar la reseña', 'error')
    }
  }

  const handleDoubleClick = (reviewId) => {
    console.log('🖱️ DOBLE CLICK detectado en reseña:', reviewId)
    const button = document.querySelector(`[data-id="${reviewId}"] .eliminar-resena`)
    console.log('🔍 Botón encontrado:', button)
    
    if (button) {
      // Mostrar el botón de eliminar
      button.style.display = 'block'
      console.log('✅ Botón de eliminar mostrado')
      
      // Ocultar después de 5 segundos
      setTimeout(() => {
        button.style.display = 'none'
        console.log('⏰ Botón de eliminar ocultado')
      }, 5000)
      
      // También mostrar un mensaje informativo
      console.log('🗑️ Botón de eliminar activado para reseña:', reviewId)
    } else {
      console.error('❌ No se encontró el botón de eliminar para reseña:', reviewId)
    }
  }

  return (
    <>
    <main>
      <div className="publicity-image-cell">
        <img src="/img/portada.png" alt="Publicidad facheritos" />
      </div>
        <div className="text-cell">
          <p><strong>Facherit@s</strong> es un emprendimiento dedicado a vestir a los niños y niñas con ropa que combina estilo, comodidad y diversión. Nos apasiona crear prendas que no solo sean atractivas y estén a la moda, sino que también permitan a los más pequeños moverse con libertad y disfrutar de sus juegos y aventuras diarias.</p>

          <p>En <strong>Facherit@s</strong>, creemos que la ropa infantil debe ser tanto funcional como expresiva. Por eso, seleccionamos cuidadosamente tejidos suaves y resistentes, y diseñamos colecciones llenas de color, estampados originales y detalles encantadores que reflejan la energía y la alegría de la infancia.</p>

          <p>Nuestra misión es ofrecer a los padres una opción de vestuario infantil que cumpla con sus expectativas de calidad y diseño, mientras que a los niños les brindamos prendas que les hagan sentir cómodos y seguros de sí mismos. Queremos ser parte de sus momentos más especiales, desde sus primeros pasos hasta sus juegos más imaginativos.</p>

          <p>En <strong>Facherit@s</strong>, vestimos las sonrisas de los más pequeños, celebrando su individualidad y fomentando su creatividad a través de la ropa que eligen llevar.</p>
        </div>
      </main>

      <div className="video-container">
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube-nocookie.com/embed/9DITHjpmof4?si=D9xMTBkIChUvpHNl&amp;start=18" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>

      <section className="reviews-section">
        <h2 className="reviews-title">Lo que dicen nuestros clientes</h2>
        <p className="reviews-subtitle">Experiencias reales de familias que confían en Facherit@s</p>
        
        <div className="reviews-container">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{review.avatar}</div>
                <div className="review-info">
                  <h4>{review.name}</h4>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-stars">
                {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                  <i key={i} className="fas fa-star" style={{color:'#FFD700'}}></i>
                ))}
                {review.rating % 1 !== 0 && (
                  <i className="fas fa-star-half-alt" style={{color:'#FFD700'}}></i>
                )}
                {Array.from({ length: Math.floor(5 - review.rating) }, (_, i) => (
                  <i key={i} className="far fa-star" style={{color:'#FFD700'}}></i>
                ))}
              </div>
              <p className="review-text">"{review.comment}"</p>
              <div className="review-product">Producto: {review.product}</div>
            </div>
          ))}
        </div>

        <div className="reviews-container" id="dynamic-reviews-container">
          {dynamicReviews.map((review) => {
            console.log('📝 RENDERIZANDO RESEÑA:', review)
            return (
            <div 
              key={review.ID || review.id} 
              className="review-card" 
              data-id={review.ID || review.id} 
              onDoubleClick={() => handleDoubleClick(review.ID || review.id)}
            >
              <div className="review-header">
                <div className="review-avatar">{(review.name || 'A')[0].toUpperCase()}</div>
                <div className="review-info">
                  <h4>{review.name}</h4>
                  <div className="review-date">
                    {review.date ? new Date(review.date).toLocaleDateString('es-AR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : new Date().toLocaleDateString('es-AR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              <div className="review-stars">
                {Array.from({ length: review.rating }, (_, i) => (
                  <i key={i} className="fas fa-star" style={{color:'#FFD700'}}></i>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => (
                  <i key={i} className="far fa-star" style={{color:'#FFD700'}}></i>
                ))}
              </div>
              <p className="review-text">"{review.comment}"</p>
              <div className="review-product">
                {(() => {
                  const product = review.producto || review.product || ''
                  const size = review.talle || review.size || ''
                  
                  if (product || size) {
                    return (
                      <>
                        {product ? `Producto: ${product}` : 'Producto: No especificado'}
                        {size ? ` - Talle: ${size}` : ' - Talle: No especificado'}
                      </>
                    )
                  } else {
                    return 'Producto: No especificado - Talle: No especificado'
                  }
                })()}
              </div>
              <button 
                className="eliminar-resena" 
                data-id={review.ID || review.id} 
                style={{ display: 'none' }}
                onClick={(e) => {
                  e.stopPropagation()
                  deleteReview(review.ID || review.id)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="7" width="14" height="12" rx="2" fill="#fff6fa" stroke="#e07bb7" strokeWidth="2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1.5" fill="#e07bb7"/>
                  <line x1="8.5" y1="10" x2="8.5" y2="16" stroke="#e07bb7" strokeWidth="1.5"/>
                  <line x1="12" y1="10" x2="12" y2="16" stroke="#e07bb7" strokeWidth="1.5"/>
                  <line x1="15.5" y1="10" x2="15.5" y2="16" stroke="#e07bb7" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            )
          })}
        </div>

        <form id="review-form" onSubmit={handleSubmitReview}>
          <h3>¡Dejá tu reseña!</h3>
          <div>
            <label htmlFor="review-stars">Calificación:</label><br/>
            <span id="star-select">
              {[1,2,3,4,5].map(star => (
                <i 
                  key={star}
                  className={star <= selectedStars ? "fas fa-star" : "far fa-star"} 
                  data-star={star} 
                  onClick={() => handleStarClick(star)}
                ></i>
              ))}
            </span>
          </div>
          <div>
            <textarea 
              id="review-text" 
              rows="3" 
              maxLength="200" 
              placeholder="Escribí tu experiencia..." 
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            />
          </div>
          <div>
              <input
              id="review-name" 
                type="text"
              maxLength="30" 
              placeholder="Tu nombre" 
              required 
                value={newReview.name}
                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
              />
            </div>
          <div>
              <input
              id="review-product" 
                type="text"
              maxLength="40" 
              placeholder="Producto (opcional)" 
                value={newReview.product}
                onChange={(e) => setNewReview({...newReview, product: e.target.value})}
              />
            </div>
          <div>
            <input 
              id="review-size" 
              type="text" 
              maxLength="10" 
              placeholder="Talle (opcional)" 
              value={newReview.talle}
              onChange={(e) => setNewReview({...newReview, talle: e.target.value})}
              />
            </div>
          <button type="submit">
              Enviar reseña
            </button>
          </form>
      </section>
    </>
  )
}

export default Home