const DEFAULT_BASE_URL = 'https://68ee717fdf2025af7803b475.mockapi.io'
const PRODUCTS_URL = import.meta.env.VITE_MOCKAPI_PRODUCTS_URL || `${import.meta.env.VITE_MOCKAPI_BASE_URL || DEFAULT_BASE_URL}/products`

async function request(url, options = {}) {
  const finalOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  }

  const response = await fetch(url, finalOptions)
  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`
    try {
      const errorBody = await response.json()
      if (errorBody?.message) {
        message = errorBody.message
      }
    } catch {
      // Ignorar parse fallido
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function loadLocalProducts() {
  const localRes = await fetch('/products.json', { cache: 'no-store' })
  if (!localRes.ok) {
    throw new Error('No se pudo acceder al catálogo local')
  }
  const localData = await localRes.json()
  return localData.map((p) => {
    if (p.categoria) return p
    const img = String(p.imagen || '')
    const categoria = img.includes('/ropa-nina/')
      ? 'ninas'
      : img.includes('/ropa-nino/')
      ? 'ninos'
      : img.includes('/accesorios/')
      ? 'accesorios'
      : 'productos'
    return { ...p, categoria }
  })
}

export const productsApi = {
  async getAll() {
    try {
      const data = await request(PRODUCTS_URL)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.warn('⚠️ MockAPI no disponible, usando catálogo local.', error)
      return loadLocalProducts()
    }
  },

  async create(product) {
    return request(PRODUCTS_URL, {
      method: 'POST',
      body: JSON.stringify(product)
    })
  },

  async update(id, product) {
    return request(`${PRODUCTS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    })
  },

  async remove(id) {
    await request(`${PRODUCTS_URL}/${id}`, {
      method: 'DELETE'
    })
    return true
  }
}

export async function fetchProducts() {
  return productsApi.getAll()
}


