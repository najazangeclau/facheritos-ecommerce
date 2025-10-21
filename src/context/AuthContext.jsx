import { createContext, useContext, useState, useEffect } from 'react'
import { usersService } from '../services/firebaseService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    // Crear usuario admin si no existe
    const existingUsers = JSON.parse(localStorage.getItem('facheritos_users') || '[]')
    const adminExists = existingUsers.find(u => u.email === 'admin@facheritos.com')
    
    if (!adminExists) {
      const adminUser = {
        id: 'admin-001',
        name: 'Administrador',
        email: 'admin@facheritos.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'A',
        createdAt: new Date().toISOString()
      }
      existingUsers.push(adminUser)
      localStorage.setItem('facheritos_users', JSON.stringify(existingUsers))
      console.log('✅ Usuario admin creado automáticamente')
    }

    const savedUser = localStorage.getItem('facheritos_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error cargando usuario:', error)
        localStorage.removeItem('facheritos_user')
      }
    }
    setLoading(false)
  }, [])

  // Login
  const login = async (email, password) => {
    setLoading(true)
    try {
      // Simular validación (en un proyecto real sería una API)
      const users = JSON.parse(localStorage.getItem('facheritos_users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role || 'user',
          avatar: foundUser.avatar || foundUser.name.charAt(0).toUpperCase()
        }
        
        setUser(userData)
        localStorage.setItem('facheritos_user', JSON.stringify(userData))
        return { success: true, user: userData }
      } else {
        return { success: false, error: 'Email o contraseña incorrectos' }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: 'Error interno del servidor' }
    } finally {
      setLoading(false)
    }
  }

  // Register
  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem('facheritos_users') || '[]')
      
      // Verificar si el email ya existe
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Este email ya está registrado' }
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'user',
        avatar: name.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('facheritos_users', JSON.stringify(users))

      // Auto-login después del registro
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }

      setUser(userData)
      localStorage.setItem('facheritos_user', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, error: 'Error interno del servidor' }
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('facheritos_user')
  }

  // Verificar si es admin
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  // Verificar si está autenticado
  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
