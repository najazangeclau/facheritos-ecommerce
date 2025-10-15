import { Outlet } from 'react-router-dom'
import Header from './components/layout/Header'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProductAddedNotification from './components/ProductAddedNotification'
import { useCart } from './context/CartContext'

function App() {
  const { notification, closeNotification } = useCart()

  console.log('App - notification:', notification)

  return (
    <>
      <Header />
      <Navbar />
      <Outlet />
      <Footer />
      <ProductAddedNotification 
        isVisible={notification.isVisible}
        productName={notification.product?.nombre}
        onClose={closeNotification}
      />
    </>
  )
}

export default App
