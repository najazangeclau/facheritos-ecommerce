import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { productsApi } from '../services/products'

const ProductContext = createContext(null)

const normalizeProductPayload = (product) => {
  const nombre = product.nombre?.trim() || ''
  const precio = Number(product.precio)
  const categoria = product.categoria?.trim() || ''
  const descripcion = product.descripcion?.trim() || ''
  const imagen = product.imagen?.trim() || ''

  if (!nombre) {
    throw new Error('El nombre es obligatorio')
  }

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El precio debe ser mayor a 0')
  }

  if (!categoria) {
    throw new Error('Seleccioná una categoría')
  }

  if (descripcion.length < 10) {
    throw new Error('La descripción debe tener al menos 10 caracteres')
  }

  return {
    nombre,
    precio,
    categoria,
    descripcion,
    imagen: imagen || '/img/logo.png'
  }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productsApi.getAll()
      setProducts(data)
      setError(null)
    } catch (err) {
      console.error('❌ Error cargando productos:', err)
      setError(err.message || 'No se pudieron obtener los productos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const createProduct = useCallback(
    async (productData) => {
      const payload = normalizeProductPayload(productData)
      const created = await productsApi.create(payload)
      setProducts((prev) => [...prev, created])
      return created
    },
    []
  )

  const updateProduct = useCallback(
    async (id, productData) => {
      if (!id) {
        throw new Error('El producto no tiene un ID válido')
      }
      const payload = normalizeProductPayload(productData)
      const updated = await productsApi.update(id, payload)
      setProducts((prev) => prev.map((product) => (String(product.id) === String(id) ? updated : product)))
      return updated
    },
    []
  )

  const deleteProduct = useCallback(async (id) => {
    if (!id) {
      throw new Error('El producto no tiene un ID válido')
    }
    await productsApi.remove(id)
    setProducts((prev) => prev.filter((product) => String(product.id) !== String(id)))
  }, [])

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      reload: loadProducts,
      createProduct,
      updateProduct,
      deleteProduct
    }),
    [products, loading, error, loadProducts, createProduct, updateProduct, deleteProduct]
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de ProductProvider')
  }
  return context
}

