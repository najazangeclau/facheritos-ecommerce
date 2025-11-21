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
    let storedUsers = JSON.parse(localStorage.getItem('facheritos_users') || '[]')
    let usersUpdated = false

    storedUsers = storedUsers.map(userRecord => {
      if (!userRecord.createdAt) {
        usersUpdated = true
        return {
          ...userRecord,
          createdAt: new Date().toISOString()
        }
      }
      return userRecord
    })

    const adminExists = storedUsers.find(u => u.email === 'admin@facheritos.com')
    
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
      storedUsers.push(adminUser)
      usersUpdated = true
      console.log('✅ Usuario admin creado automáticamente')
    }

    if (usersUpdated) {
      localStorage.setItem('facheritos_users', JSON.stringify(storedUsers))
    }

    const savedUser = localStorage.getItem('facheritos_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        if (!parsedUser.createdAt) {
          const match = storedUsers.find(u => u.id === parsedUser.id)
          if (match?.createdAt) {
            parsedUser.createdAt = match.createdAt
            localStorage.setItem('facheritos_user', JSON.stringify(parsedUser))
          }
        }
        setUser(parsedUser)
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
      const users = JSON.parse(localStorage.getItem('facheritos_users') || '[]')
      const userIndex = users.findIndex(u => u.email === email && u.password === password)
      if (userIndex !== -1) {
        const foundUser = users[userIndex]
        const createdAt = foundUser.createdAt || new Date().toISOString()
        if (!foundUser.createdAt) {
          users[userIndex].createdAt = createdAt
          localStorage.setItem('facheritos_users', JSON.stringify(users))
        }

        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role || 'user',
          avatar: foundUser.avatar || foundUser.name.charAt(0).toUpperCase(),
          createdAt
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
        avatar: newUser.avatar,
        createdAt: newUser.createdAt
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

  const resetPassword = async (email, newPassword) => {
    setLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem('facheritos_users') || '[]')
      const userIndex = users.findIndex(u => u.email === email)

      if (userIndex === -1) {
        return { success: false, error: 'No encontramos una cuenta con ese email' }
      }

      users[userIndex].password = newPassword
      localStorage.setItem('facheritos_users', JSON.stringify(users))

      if (user?.email === email) {
        const updatedUser = {
          id: users[userIndex].id,
          name: users[userIndex].name,
          email: users[userIndex].email,
          role: users[userIndex].role || 'user',
          avatar: users[userIndex].avatar || users[userIndex].name.charAt(0).toUpperCase(),
          createdAt: users[userIndex].createdAt
        }
        setUser(updatedUser)
        localStorage.setItem('facheritos_user', JSON.stringify(updatedUser))
      }

      return { success: true }
    } catch (error) {
      console.error('Error reseteando contraseña:', error)
      return { success: false, error: 'No pudimos restablecer la contraseña. Intentalo más tarde.' }
    } finally {
      setLoading(false)
    }
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
    resetPassword,
    isAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
