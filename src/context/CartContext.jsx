import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

// Mapeo de nombres de productos a sus IDs reales en products.json
const PRODUCTOS_2X1_NAMES = ['Bermuda Jean', 'Pantalón Cargo', 'Pollera Recta', 'Vincha']
const PRODUCTOS_LIQUIDACION_NAMES = ['Vestido Flores', 'Vestido Floreado', 'Jogging', 'Anteojo']

// Función para validar si un producto con cierta combinación talle/color debe tener oferta
const validateOffer = (product, talle, color) => {
  // Verificar si el producto está en las listas de ofertas por nombre
  const isIn2x1List = PRODUCTOS_2X1_NAMES.includes(product.nombre)
  const isInLiquidacionList = PRODUCTOS_LIQUIDACION_NAMES.includes(product.nombre)
  
  // Si no está en ninguna lista de ofertas, no tiene oferta
  if (!isIn2x1List && !isInLiquidacionList) {
    return { es2x1: false, esLiquidacion: false }
  }
  
  // Configuraciones específicas por producto para ofertas (igual que en ProductModal)
  const offerConfigs = {
    // Liquidación
    'Vestido Flores': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
    'Vestido Floreado': { talles: ['4', '8', '12'], colores: ['Rosa', 'Violeta', 'Blanco'] },
    'Jogging': { talles: ['6', '10', '14'], colores: ['Azul', 'Negro', 'Gris'] },
    'Anteojo': { talles: ['Mediano'], colores: ['Negro', 'Azul', 'Rosa'] },
    
    // 2x1
    'Bermuda Jean': { talles: ['4', '8', '12'], colores: ['Azul', 'Negro', 'Verde'] },
    'Pantalón Cargo': { talles: ['6', '10', '14'], colores: ['Beige', 'Verde', 'Negro'] },
    'Pollera Recta': { talles: ['4', '8', '12'], colores: ['Rosa', 'Azul', 'Blanco'] },
    'Vincha': { talles: ['Mediano'], colores: ['Rosa', 'Azul', 'Violeta'] }
  }
  
  const config = offerConfigs[product.nombre]
  if (!config) {
    // Si está en la lista pero no tiene configuración, aplicar oferta sin restricciones
    return {
      es2x1: isIn2x1List,
      esLiquidacion: isInLiquidacionList
    }
  }
  
  const hasValidTalle = config.talles.includes(talle)
  const hasValidColor = config.colores.includes(color)
  const isValidOffer = hasValidTalle && hasValidColor
  
  return {
    es2x1: isValidOffer && isIn2x1List,
    esLiquidacion: isValidOffer && isInLiquidacionList
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [notification, setNotification] = useState({ isVisible: false, product: null })

  const addItem = (product, options = {}) => {
    const { talle = 'M', color = 'Azul', cantidad = 1 } = options
    
    // Validar ofertas basado en talle/color actual
    const offerValidation = validateOffer(product, talle, color)
    
    console.log('🛒 CART CONTEXT - AGREGANDO PRODUCTO:')
    console.log('  - Producto completo:', product)
    console.log('  - Nombre:', product.nombre)
    console.log('  - ID:', product.id)
    console.log('  - Talle recibido:', talle)
    console.log('  - Color recibido:', color)
    console.log('  - Cantidad recibida:', cantidad)
    console.log('  - Validación oferta:', offerValidation)
    console.log('  - Está en lista 2x1:', PRODUCTOS_2X1_NAMES.includes(product.nombre))
    console.log('  - Está en lista liquidación:', PRODUCTOS_LIQUIDACION_NAMES.includes(product.nombre))
    console.log('  - Es producto 2x1:', offerValidation.es2x1)
    console.log('  - Es producto liquidación:', offerValidation.esLiquidacion)
    
    // Calcular precio para liquidación
    let precioFinal = product.precio
    let precioOriginal = product.precio
    
    if (offerValidation.esLiquidacion) {
      // Aplicar descuentos específicos por producto
      switch (product.nombre) {
        case 'Vestido Flores':
        case 'Vestido Floreado':
          precioFinal = 3300 // 70% descuento de $11,000
          precioOriginal = 11000
          break
        case 'Jogging':
          precioFinal = 4750 // 50% descuento de $9,500
          precioOriginal = 9500
          break
        case 'Anteojo':
          precioFinal = 3000 // 60% descuento de $7,500
          precioOriginal = 7500
          break
        default:
          precioFinal = product.precio
          precioOriginal = product.precio
      }
    }
    
    // Crear items individuales para cada cantidad
    setItems(prev => {
      console.log('🔄 CART CONTEXT - ESTADO ANTERIOR:', prev.length, 'items')
      const newItems = []
      
      // Agregar la cantidad especificada como items individuales
      for (let i = 0; i < cantidad; i++) {
        const individualKey = `${product.id}-${talle}-${color}-${Date.now()}-${i}` // Key única para cada item
        newItems.push({
          ...product,
          key: individualKey,
          talle, 
          color, 
          quantity: 1, // Cada item individual tiene cantidad 1
          precioUnitario: product.precio,
          es2x1: offerValidation.es2x1,
          esLiquidacion: offerValidation.esLiquidacion,
          precio: precioFinal,
          precioOriginal: precioOriginal
        })
      }
      
      console.log('  - Items individuales creados:', newItems.length)
      const finalItems = [...prev, ...newItems]
      console.log('🔄 CART CONTEXT - ESTADO FINAL:', finalItems.length, 'items')
      return finalItems
    })
    
    // Resetear notificación primero, luego mostrar nueva
    setNotification({ isVisible: false, product: null })
    setTimeout(() => {
    setNotification({ isVisible: true, product })
    }, 100)
  }

  const removeItem = (key) => {
    console.log('🗑️ CART CONTEXT - ELIMINANDO ITEM:')
    console.log('  - Key recibida:', key)
    
    // Si es un item 2x1 (tiene -paid- o -free- en la key), extraer la key original
    let originalKey = key
    if (key.includes('-paid') || key.includes('-free')) {
      originalKey = key.split('-paid')[0].split('-free')[0]
    }
    
    // Eliminar solo el item específico (no importa si es 2x1 o no)
    console.log('  - Eliminando item específico con key:', originalKey)
    setItems(prev => prev.filter(item => item.key !== originalKey))
  }

  const updateQuantity = (key, newQuantity) => {
    console.log('🔄 CART CONTEXT - ACTUALIZANDO CANTIDAD:')
    console.log('  - Key recibida:', key)
    console.log('  - Nueva cantidad:', newQuantity)
    
    if (newQuantity <= 0) {
      // Eliminar el item
      removeItem(key)
      return
    }
    
    // Si es un item 2x1 (tiene -paid- o -free-), extraer la key original
    let originalKey = key
    if (key.includes('-paid') || key.includes('-free')) {
      originalKey = key.split('-paid')[0].split('-free')[0]
    }
    
    console.log('  - Key original:', originalKey)
    
    // Encontrar el item original
    const originalItem = items.find(item => item.key === originalKey)
    if (!originalItem) return
    
    const is2x1Product = PRODUCTOS_2X1_NAMES.includes(originalItem.nombre)
    
    if (is2x1Product) {
      // Para productos 2x1, usar la lógica de grupos
      const currentGroupItems = items.filter(item => item.nombre === originalItem.nombre)
      const currentTotalQuantity = currentGroupItems.reduce((sum, item) => sum + item.quantity, 0)
      const difference = newQuantity - currentTotalQuantity
      
      console.log('  - Cantidad actual del grupo:', currentTotalQuantity)
      console.log('  - Diferencia:', difference)
    
      if (difference > 0) {
      // Agregar items
      const baseItem = currentGroupItems[0]
      if (baseItem) {
        const newItems = []
        for (let i = 0; i < difference; i++) {
          const individualKey = `${baseItem.id}-${baseItem.talle}-${baseItem.color}-${Date.now()}-${i}`
          newItems.push({
            ...baseItem,
            key: individualKey,
            quantity: 1
          })
        }
        setItems(prev => [...prev, ...newItems])
      }
    } else if (difference < 0) {
      // Quitar items
      const itemsToRemove = Math.abs(difference)
      let removedCount = 0
      
      setItems(prev => prev.filter(item => {
        let shouldRemove = false
        
        if (is2x1Product) {
          // Para productos 2x1, agrupar por nombre de producto
          shouldRemove = item.nombre === originalItem.nombre && removedCount < itemsToRemove
        } else {
          // Para otros productos, agrupar por producto + talle + color
          const itemGroupKey = `${item.id}-${item.talle}-${item.color}`
          const targetGroupKey = originalKey.split('-').slice(0, 3).join('-')
          shouldRemove = itemGroupKey === targetGroupKey && removedCount < itemsToRemove
        }
        
        if (shouldRemove) {
          removedCount++
          return false // Remover este item
        }
        return true // Mantener este item
      }))
    }
    } else {
      // Para productos individuales (no 2x1), agregar o quitar items según la diferencia
      console.log('  - Producto individual, gestionando items')
      
      // Contar cuántos items existen con la misma combinación id-talle-color
      const itemGroupKey = `${originalItem.id}-${originalItem.talle}-${originalItem.color}`
      const currentGroupItems = items.filter(item => {
        const currentItemGroupKey = `${item.id}-${item.talle}-${item.color}`
        return currentItemGroupKey === itemGroupKey
      })
      const currentTotalQuantity = currentGroupItems.length
      const difference = newQuantity - currentTotalQuantity
      
      console.log('  - Cantidad actual del grupo:', currentTotalQuantity)
      console.log('  - Nueva cantidad solicitada:', newQuantity)
      console.log('  - Diferencia:', difference)
      console.log('  - Items del grupo:', currentGroupItems.map(item => ({ key: item.key, quantity: item.quantity })))
      
      if (difference > 0) {
        // Agregar items
        const newItems = []
        for (let i = 0; i < difference; i++) {
          const individualKey = `${originalItem.id}-${originalItem.talle}-${originalItem.color}-${Date.now()}-${i}`
          newItems.push({
            ...originalItem,
            key: individualKey,
            quantity: 1
          })
        }
        console.log('  - Agregando', difference, 'items nuevos')
        console.log('  - Items a agregar:', newItems.map(item => ({ key: item.key, nombre: item.nombre })))
        setItems(prev => {
          const newState = [...prev, ...newItems]
          console.log('  - Estado anterior:', prev.length, 'items')
          console.log('  - Estado nuevo:', newState.length, 'items')
          return newState
        })
      } else if (difference < 0) {
        // Quitar items
        const itemsToRemove = Math.abs(difference)
        let removedCount = 0
        
        console.log('  - Quitando', itemsToRemove, 'items')
        setItems(prev => prev.filter(item => {
          const currentItemGroupKey = `${item.id}-${item.talle}-${item.color}`
          const shouldRemove = currentItemGroupKey === itemGroupKey && removedCount < itemsToRemove
          
          if (shouldRemove) {
            removedCount++
            return false // Remover este item
          }
          return true // Mantener este item
        }))
      }
    }
  }

  const updateTalle = (key, newTalle) => {
    console.log('🔄 CART CONTEXT - ACTUALIZANDO TALLE:')
    console.log('  - Key recibida:', key)
    console.log('  - Nuevo talle:', newTalle)
    
    // Si es un item 2x1 (tiene -paid o -free), extraer la key original
    let originalKey = key
    if (key.includes('-paid') || key.includes('-free')) {
      originalKey = key.split('-paid')[0].split('-free')[0]
    }
    
    // Actualizar directamente en el array de items
    setItems(prev => prev.map(item => {
      if (item.key === originalKey) {
        // Validar ofertas con el nuevo talle y color actual
        const offerValidation = validateOffer(item, newTalle, item.color)
        
        // Calcular precio para liquidación
        let precioFinal = item.precioUnitario
        let precioOriginal = item.precioUnitario
        
        if (offerValidation.esLiquidacion) {
          // Aplicar descuentos específicos por producto
          switch (item.nombre) {
            case 'Vestido Flores':
            case 'Vestido Floreado':
              precioFinal = 3300 // 70% descuento de $11,000
              precioOriginal = 11000
              break
            case 'Jogging':
              precioFinal = 4750 // 50% descuento de $9,500
              precioOriginal = 9500
              break
            case 'Anteojo':
              precioFinal = 3000 // 60% descuento de $7,500
              precioOriginal = 7500
              break
            default:
              precioFinal = item.precioUnitario
              precioOriginal = item.precioUnitario
          }
        }
        
        return {
          ...item,
          talle: newTalle,
          es2x1: offerValidation.es2x1,
          esLiquidacion: offerValidation.esLiquidacion,
          precio: precioFinal,
          precioOriginal: precioOriginal
        }
      }
      return item
    }))
  }

  const updateColor = (key, newColor) => {
    console.log('🔄 CART CONTEXT - ACTUALIZANDO COLOR:')
    console.log('  - Key recibida:', key)
    console.log('  - Nuevo color:', newColor)
    
    // Si es un item 2x1 (tiene -paid o -free), extraer la key original
    let originalKey = key
    if (key.includes('-paid') || key.includes('-free')) {
      originalKey = key.split('-paid')[0].split('-free')[0]
    }
    
    // Actualizar directamente en el array de items
    setItems(prev => prev.map(item => {
      if (item.key === originalKey) {
        // Validar ofertas con el talle actual y nuevo color
        const offerValidation = validateOffer(item, item.talle, newColor)
        
        // Calcular precio para liquidación
        let precioFinal = item.precioUnitario
        let precioOriginal = item.precioUnitario
        
        if (offerValidation.esLiquidacion) {
          // Aplicar descuentos específicos por producto
          switch (item.nombre) {
            case 'Vestido Flores':
            case 'Vestido Floreado':
              precioFinal = 3300 // 70% descuento de $11,000
              precioOriginal = 11000
              break
            case 'Jogging':
              precioFinal = 4750 // 50% descuento de $9,500
              precioOriginal = 9500
              break
            case 'Anteojo':
              precioFinal = 3000 // 60% descuento de $7,500
              precioOriginal = 7500
              break
            default:
              precioFinal = item.precioUnitario
              precioOriginal = item.precioUnitario
          }
        }
        
        return {
          ...item,
          color: newColor,
          es2x1: offerValidation.es2x1,
          esLiquidacion: offerValidation.esLiquidacion,
          precio: precioFinal,
          precioOriginal: precioOriginal
        }
      }
      return item
    }))
  }

  const clear = () => {
    setItems([])
    setNotification({ isVisible: false, product: null })
  }

  // Lógica 2x1 - VERSIÓN SIMPLIFICADA
  const itemsWithPromo = useMemo(() => {
    const result = []
    
    // Agrupar items por producto (para 2x1) o por producto + talle + color (para otros)
    const groupedItems = {}
    
    items.forEach(item => {
      // Para productos 2x1, agrupar por nombre de producto (no por ID)
      // Para otros productos, agrupar por producto + talle + color
      const is2x1Product = PRODUCTOS_2X1_NAMES.includes(item.nombre)
      const groupKey = is2x1Product ? `${item.nombre}` : `${item.id}-${item.talle}-${item.color}`
      
      if (!groupedItems[groupKey]) {
        groupedItems[groupKey] = {
          items: [],
          totalQuantity: 0,
          baseItem: item,
          is2x1Group: is2x1Product
        }
      }
      
      groupedItems[groupKey].items.push(item)
      groupedItems[groupKey].totalQuantity += item.quantity
    })
    
    // Procesar cada grupo
    Object.values(groupedItems).forEach(group => {
      const { items: groupItems, totalQuantity, baseItem, is2x1Group } = group
      
      // Validar ofertas basado en talle/color del item base
      const offerValidation = validateOffer(baseItem, baseItem.talle, baseItem.color)
      const is2x1 = offerValidation.es2x1
      const isLiquidacion = offerValidation.esLiquidacion
      
      console.log('🛒 CART CONTEXT - PROCESANDO GRUPO:')
      console.log('  - Producto:', baseItem.nombre)
      console.log('  - Es grupo 2x1:', is2x1Group)
      console.log('  - Total cantidad:', totalQuantity)
      console.log('  - Es 2x1:', is2x1)
      console.log('  - Es Liquidación:', isLiquidacion)
      
      if (is2x1 && is2x1Group) {
        // Para productos 2x1, aplicar lógica de pagado/gratis
        // Contar solo los items que realmente tienen oferta 2x1
        const valid2x1Items = groupItems.filter(item => {
          const itemOfferValidation = validateOffer(item, item.talle, item.color)
          return itemOfferValidation.es2x1
        })
        
        const totalValidQuantity = valid2x1Items.length
        const totalPaid = Math.ceil(totalValidQuantity / 2)
        const totalFree = totalValidQuantity - totalPaid
        
        console.log('  - Items válidos para 2x1:', totalValidQuantity)
        console.log('  - Total pagados:', totalPaid)
        console.log('  - Total gratis:', totalFree)
        
        // Distribuir items individuales entre pagados y gratis
        let paidCount = 0
        let freeCount = 0
        
        groupItems.forEach((item, index) => {
          // Validar si este item específico tiene oferta 2x1
          const itemOfferValidation = validateOffer(item, item.talle, item.color)
          const has2x1Offer = itemOfferValidation.es2x1
          
          // Determinar si este item es pagado o gratis
          let isPaid = false
          if (has2x1Offer) {
            if (paidCount < totalPaid) {
              isPaid = true
              paidCount++
            } else if (freeCount < totalFree) {
              isPaid = false
              freeCount++
            }
          } else {
            // Si no tiene oferta 2x1, se paga completo
            isPaid = true
          }
          
          const processedKey = isPaid ? `${item.key}-paid-${paidCount-1}` : `${item.key}-free-${freeCount-1}`
          
          result.push({ 
            ...item, 
            quantity: 1,
            esGratis: !isPaid,
            key: processedKey,
            originalKey: item.key,
            precio: isPaid ? item.precio : 0,
            precioOriginal: item.precioOriginal
          })
        })
        
      } else {
        // Producto normal o liquidación, agregar items individuales
        groupItems.forEach((item, index) => {
          result.push({ 
            ...item, 
            esGratis: false
          })
        })
      }
    })
    
    return result
  }, [items])

  const totalItems = useMemo(() => 
    itemsWithPromo.reduce((sum, item) => sum + item.quantity, 0), 
    [itemsWithPromo]
  )

  const totalPrice = useMemo(() => 
    itemsWithPromo.reduce((sum, item) => {
      // Para items 2x1, solo sumar los que no son gratis
      if (item.esGratis) {
        return sum
      }
      return sum + item.precio
    }, 0), 
    [itemsWithPromo]
  )

  const value = useMemo(() => ({
    items, // Items originales
    itemsWithPromo, // Items procesados con lógica 2x1
    totalItems,
    totalPrice,
      addItem, 
      removeItem, 
      updateQuantity,
      updateTalle,
      updateColor,
      clear, 
      notification,
    setNotification
  }), [items, itemsWithPromo, totalItems, totalPrice, notification])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}