export async function fetchProducts() {
  // 1) Intentar cargar catálogo infantil local desde public/products.json
  try {
    const localRes = await fetch('/products.json', { cache: 'no-store' })
    if (localRes.ok) {
      const localData = await localRes.json()
      // Normalizar: si falta categoria, inferir por ruta de imagen
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
  } catch (_) {
    // Ignorar y hacer fallback
  }

  // 2) Fallback temporal a API pública para desarrollo
  const res = await fetch('https://fakestoreapi.com/products')
  if (!res.ok) throw new Error('Error cargando productos')
  const data = await res.json()
  return data.map((p) => ({ id: p.id, nombre: p.title, precio: Math.round(p.price * 1000), imagen: p.image }))
}


