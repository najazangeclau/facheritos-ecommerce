import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import Carrito from './pages/Carrito.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import Contacto from './pages/Contacto.jsx'
import ProductosNina from './pages/ProductosNina.jsx'
import ProductosNino from './pages/ProductosNino.jsx'
import ProductosBebe from './pages/ProductosBebe.jsx'
import Accesorios from './pages/Accesorios.jsx'
import Ofertas from './pages/Ofertas.jsx'
import DosPorUno from './pages/DosPorUno.jsx'
import Liquidaciones from './pages/Liquidaciones.jsx'
import WhatsApp from './pages/WhatsApp.jsx'
import Ubicacion from './pages/Ubicacion.jsx'
import FormularioCompra from './pages/FormularioCompra.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import UserProfile from './pages/UserProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'productos', element: <Productos /> },
      { path: 'ninas', element: <ProductosNina /> },
      { path: 'ninos', element: <ProductosNino /> },
      { path: 'bebe', element: <ProductosBebe /> },
      { path: 'accesorios', element: <Accesorios /> },
      { path: 'ofertas', element: <Ofertas /> },
      { path: '2x1', element: <DosPorUno /> },
      { path: 'liquidaciones', element: <Liquidaciones /> },
      { path: 'whatsapp', element: <WhatsApp /> },
      { path: 'ubicacion', element: <Ubicacion /> },
      { path: 'carrito', element: <Carrito /> },
      { 
        path: 'formulario-compra', 
        element: (
          <ProtectedRoute>
            <FormularioCompra />
          </ProtectedRoute>
        )
      },
      { path: 'contacto', element: <Contacto /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'recuperar', element: <ForgotPassword /> },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      { 
        path: 'admin', 
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        )
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
