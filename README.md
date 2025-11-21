# 🛍️ Facherit@s - Tienda de Ropa Infantil

Una tienda online moderna y funcional para ropa infantil, desarrollada con React 19 y Vite. Proyecto completo con autenticación, carrito de compras, CRUD de productos, búsqueda avanzada, paginación y panel de administración.

## ✨ Características Principales

### 🛒 **Sistema de Carrito y Autenticación**
- ✅ **Carrito de compras** con Context API
- ✅ **Lógica 2x1** y liquidaciones automáticas
- ✅ **Autenticación de usuarios** con localStorage
- ✅ **Rutas protegidas** para carrito y panel admin
- ✅ **Gestión de sesiones** persistente

### 📦 **CRUD Completo de Productos**
- ✅ **Crear productos** con validaciones (nombre, precio > 0, descripción ≥ 10 caracteres)
- ✅ **Editar productos** desde el panel de administración
- ✅ **Eliminar productos** con modal de confirmación
- ✅ **Integración con MockAPI.io** para persistencia
- ✅ **Fallback a catálogo local** si la API no está disponible

### 🔍 **Búsqueda y Navegación**
- ✅ **Búsqueda en tiempo real** por nombre o descripción
- ✅ **Filtros avanzados** por categoría y rango de precio
- ✅ **Paginación** con 12 productos por página
- ✅ **Navegación intuitiva** entre páginas

### 🎨 **Optimización de Diseño**
- ✅ **Bootstrap 5** para diseño responsive
- ✅ **React Icons** para iconografía moderna
- ✅ **React Toastify** para notificaciones elegantes
- ✅ **React Helmet** para SEO optimizado
- ✅ **Styled-components** disponible para personalización

### ⭐ **Sistema de Reseñas**
- ✅ **Reseñas dinámicas** con MockAPI.io
- ✅ **Panel admin** para gestión de reseñas
- ✅ **Validación de campos** y fechas automáticas

## 🎯 **Secciones de Productos**
- **Ropa de Niña** - Catálogo completo
- **Ropa de Niño** - Catálogo completo
- **Ropa de Bebé** - Catálogo completo
- **Accesorios** - Catálogo completo
- **2x1** - Ofertas especiales 2x1
- **Liquidaciones** - Productos con descuentos

## 🔧 **Stack Tecnológico**

### **Core**
- **React 19.1.1** - Framework principal
- **Vite 7.1.7** - Build tool y dev server
- **React Router 7.9.3** - Navegación

### **Estado y Contexto**
- **Context API** - Estado global (Carrito, Autenticación, Productos)

### **UI/UX**
- **Bootstrap 5** - Sistema de grillas y componentes
- **React Icons** - Iconografía moderna
- **React Toastify** - Notificaciones toast
- **React Helmet Async** - Gestión de SEO
- **Styled-components** - Estilos modulares

### **APIs Externas**
- **MockAPI.io** - API para productos y reseñas
- **Formspree** (opcional) - Manejo de formularios

## 🚀 **Instalación y Uso**

### **Prerrequisitos**
- Node.js (versión 16 o superior)
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd facheritos-react_final

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Comandos Disponibles**
```bash
npm run dev      # Servidor de desarrollo (puerto 5173)
npm run build    # Build para producción
npm run preview  # Preview del build de producción
npm run lint     # Ejecutar linter
```

## 📁 **Estructura del Proyecto**

```
facheritos-react_final/
├── public/
│   ├── img/                 # Imágenes de productos
│   │   ├── ropa-nina/
│   │   ├── ropa-nino/
│   │   ├── ropa-bebe/
│   │   └── accesorios/
│   └── products.json        # Catálogo local de productos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── layout/         # Header, Footer, Navbar
│   │   ├── ProductModal.jsx
│   │   ├── ProductDetailModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── context/            # Contextos globales
│   │   ├── CartContext.jsx    # Estado del carrito
│   │   ├── AuthContext.jsx    # Estado de autenticación
│   │   └── ProductContext.jsx  # Estado de productos
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home.jsx        # Página principal
│   │   ├── Productos.jsx   # Catálogo con búsqueda y paginación
│   │   ├── Carrito.jsx     # Carrito de compras (protegido)
│   │   ├── AdminPanel.jsx  # Panel de administración (protegido)
│   │   ├── Login.jsx       # Inicio de sesión
│   │   ├── Register.jsx    # Registro de usuarios
│   │   └── ...
│   ├── services/           # Servicios y APIs
│   │   ├── products.js     # API de productos (MockAPI)
│   │   ├── forms.js        # Servicios de formularios
│   │   └── ...
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 **Funcionalidades Detalladas**

### **🛒 Sistema de Carrito**
- **Lógica 2x1**: Productos elegibles para oferta 2x1 (Bermuda Jean, Pantalón Cargo, Pollera Recta, Vincha)
- **Liquidaciones**: Descuentos automáticos según talle/color
- **Modificación independiente**: Cambiar talle/color sin afectar otros items
- **Persistencia**: Carrito se mantiene entre sesiones
- **Notificaciones**: Toast cuando se agrega un producto

### **🔐 Autenticación**
- **Login/Registro**: Sistema completo con localStorage
- **Recuperación de contraseña**: Página para actualizar la clave de manera segura
- **Usuario Admin**: `admin@facheritos.com` / `admin123`
- **Rutas protegidas**: Formulario de compra, perfil y panel admin requieren autenticación
- **Gestión de sesiones**: Persistencia automática

### **📦 CRUD de Productos**
- **Validaciones**:
  - Nombre: obligatorio
  - Precio: mayor a 0
  - Descripción: mínimo 10 caracteres
  - Categoría: obligatoria
- **Operaciones**:
  - Crear: Formulario controlado con validación
  - Editar: Pre-carga datos en formulario
  - Eliminar: Modal de confirmación
- **Integración**: MockAPI.io con fallback local

### **🔍 Búsqueda y Filtros**
- **Búsqueda en tiempo real**: Por nombre o descripción
- **Filtros**:
  - Por categoría (dropdown)
  - Por rango de precio (mínimo/máximo)
- **Paginación**: 12 productos por página
- **Navegación**: Botones anterior/siguiente y números de página

### **⭐ Sistema de Reseñas**
- **MockAPI.io**: API externa para almacenar reseñas
- **Panel admin**: Eliminar reseñas
- **Validación**: Campos requeridos y fechas automáticas
- **UI mejorada**: Iconos React Icons y notificaciones Toast

## 🔧 **Configuración**

### **MockAPI.io**
El proyecto usa MockAPI.io para productos y reseñas. Las URLs configuradas son:
```
Productos: https://68ee717fdf2025af7803b475.mockapi.io/products
Reseñas: https://68ee717fdf2025af7803b475.mockapi.io/reviews
```

**Configuración opcional** (variables de entorno):
```env
VITE_MOCKAPI_BASE_URL=https://tu-api.mockapi.io
VITE_MOCKAPI_PRODUCTS_URL=https://tu-api.mockapi.io/products
```

### **Productos**
Los productos se cargan desde MockAPI.io. Si la API no está disponible, se usa el fallback `public/products.json`.

### **Autenticación**
- **Usuario Admin por defecto**: 
  - Email: `admin@facheritos.com`
  - Password: `admin123`
- Los usuarios se almacenan en `localStorage` bajo la clave `facheritos_users`

## 📱 **Responsive Design**
- **Mobile First**: Diseño optimizado para móviles
- **Tablet**: Adaptado para tablets (768px+)
- **Desktop**: Experiencia completa en escritorio (1024px+)
- **Bootstrap Grid**: Sistema de grillas responsive

## 🎉 **Características Destacadas**
- ✅ **CRUD completo** - Gestión total de productos
- ✅ **Autenticación** - Sistema de usuarios y roles
- ✅ **Carrito inteligente** - Lógica de ofertas automática
- ✅ **Búsqueda avanzada** - Filtros y paginación
- ✅ **SEO optimizado** - React Helmet en todas las páginas
- ✅ **Notificaciones modernas** - React Toastify
- ✅ **Iconografía moderna** - React Icons
- ✅ **Responsive** - Funciona en todos los dispositivos
- ✅ **Accesibilidad** - ARIA labels y navegación por teclado

## 🚀 **Deployment**

### **🌐 Netlify (Recomendado)**

#### **Opción 1: Deploy Automático desde GitHub**
1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/facheritos.git
   git push -u origin main
   ```

2. **Conecta con Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - "New site from Git"
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración

3. **Configura Variables de Entorno** (opcional):
   - En Netlify: Site settings → Environment variables
   - Agrega:
     - `VITE_MOCKAPI_BASE_URL` (si usas tu propia API)
     - `VITE_FORMSPREE_CONTACTO` (si usas Formspree)
     - `VITE_FORMSPREE_COMPRA` (si usas Formspree)

#### **Opción 2: Deploy Manual**
```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

### **📧 Configuración de Formularios (Opcional)**

#### **Formspree (Recomendado):**
- **Gratuito:** 50 submissions/mes
- **Panel admin:** Ve todos los formularios
- **Anti-spam:** Protección automática
- **Email notifications:** Recibes emails automáticamente

#### **Netlify Forms (Alternativa):**
- **Integrado:** Con Netlify
- **Sin límites:** En plan gratuito
- **Panel admin:** En Netlify dashboard

### **🔧 Variables de Entorno (Opcional)**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_MOCKAPI_BASE_URL=https://tu-api.mockapi.io
VITE_MOCKAPI_PRODUCTS_URL=https://tu-api.mockapi.io/products
VITE_FORMSPREE_CONTACTO=https://formspree.io/f/YOUR_FORM_ID
VITE_FORMSPREE_COMPRA=https://formspree.io/f/YOUR_FORM_ID_2
```

### **📱 Otros Hostings**
- **Vercel** - Similar a Netlify, deploy automático desde GitHub
- **GitHub Pages** - Gratuito, solo frontend
- **Firebase Hosting** - De Google
- **Cualquier hosting estático** - Sube la carpeta `dist` después de `npm run build`

## 🧪 **Pruebas de Compatibilidad**

### **Navegadores Soportados**
- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Opera (últimas 2 versiones)

### **Dispositivos**
- ✅ Móviles (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)

### **Funcionalidades Probadas**
- ✅ Carrito de compras
- ✅ Autenticación y rutas protegidas
- ✅ CRUD de productos
- ✅ Búsqueda y paginación
- ✅ Responsive design
- ✅ Notificaciones toast
- ✅ SEO y meta tags

## 📝 **Notas de Desarrollo**

### **Estructura de Contextos**
- **CartContext**: Maneja el estado del carrito, ofertas 2x1 y liquidaciones
- **AuthContext**: Maneja autenticación, login, registro y roles
- **ProductContext**: Maneja el catálogo de productos y operaciones CRUD

### **Servicios**
- **products.js**: API de productos con MockAPI.io y fallback local
- **forms.js**: Servicios de formularios (contacto, compras, reseñas)

### **Optimizaciones**
- Uso de `useMemo` y `useCallback` para optimizar renders
- Lazy loading de imágenes
- Paginación para mejorar rendimiento
- Limpieza de console.logs en producción

## 🤝 **Contribución**

Este es un proyecto educativo. Para contribuir:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto es de uso educativo.

---

**Desarrollado con ❤️ para Facherit@s**
