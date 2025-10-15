# 🛍️ Facheritos - Tienda de Ropa Infantil

Una tienda online moderna y funcional para ropa infantil, desarrollada con React y Vite.

## ✨ Características

### 🛒 **Funcionalidades Principales**
- **Carrito de compras** con lógica 2x1 y liquidaciones
- **Sistema de ofertas** (2x1 y liquidación)
- **Reseñas dinámicas** con MockAPI.io
- **Modal de detalles** para cada producto
- **Panel de administración** para reseñas

### 🎯 **Secciones de Productos**
- **Ropa de Niña** - Productos completos sin ofertas
- **Ropa de Niño** - Productos completos sin ofertas  
- **Ropa de Bebé** - Productos completos sin ofertas
- **Accesorios** - Productos completos sin ofertas
- **2x1** - Ofertas especiales 2x1
- **Liquidaciones** - Productos con descuentos

### 🔧 **Tecnologías**
- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Context API** - Estado global del carrito
- **MockAPI.io** - API externa para reseñas
- **CSS3** - Estilos modernos y responsive

## 🚀 **Instalación y Uso**

### **Prerrequisitos**
- Node.js (versión 16 o superior)
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd facheritos-react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Comandos Disponibles**
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 📁 **Estructura del Proyecto**

```
facheritos-react/
├── public/
│   ├── img/                 # Imágenes de productos
│   └── products.json        # Base de datos de productos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── layout/         # Header, Footer, Navbar
│   │   ├── ProductModal.jsx
│   │   └── ProductDetailModal.jsx
│   ├── context/
│   │   └── CartContext.jsx # Estado global del carrito
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home.jsx        # Página principal con reseñas
│   │   ├── Carrito.jsx     # Carrito de compras
│   │   ├── Productos*.jsx  # Páginas de productos
│   │   └── ...
│   ├── services/
│   │   └── products.js     # Servicios de productos
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── package.json
└── vite.config.js
```

## 🎨 **Funcionalidades Especiales**

### **🛒 Sistema de Carrito**
- **Lógica 2x1**: Productos elegibles para oferta 2x1
- **Liquidaciones**: Descuentos automáticos
- **Modificación independiente**: Cambiar talle/color sin afectar otros items
- **Persistencia**: Carrito se mantiene entre sesiones

### **⭐ Sistema de Reseñas**
- **MockAPI.io**: API externa para almacenar reseñas
- **Panel admin**: Eliminar reseñas con contraseña (`admin123`)
- **Doble click**: Activar botón de eliminar
- **Validación**: Campos requeridos y fechas automáticas

### **🎯 Modal de Detalles**
- **Información completa**: Descripción, precios, ofertas
- **Opciones completas**: Todos los talles y colores disponibles
- **Agregar al carrito**: Directamente desde el modal
- **Responsive**: Adaptado a diferentes pantallas

## 🔧 **Configuración**

### **MockAPI.io**
El proyecto usa MockAPI.io para las reseñas. La URL configurada es:
```
https://68ee717fdf2025af7803b475.mockapi.io/reviews
```

### **Productos**
Los productos se cargan desde `public/products.json` y se pueden modificar fácilmente.

## 📱 **Responsive Design**
- **Mobile First**: Diseño optimizado para móviles
- **Tablet**: Adaptado para tablets
- **Desktop**: Experiencia completa en escritorio

## 🎉 **Características Destacadas**
- ✅ **Sin backend local** - Solo frontend + API externa
- ✅ **Carrito inteligente** - Lógica de ofertas automática
- ✅ **Reseñas dinámicas** - Sistema completo de reviews
- ✅ **Panel admin** - Gestión de reseñas
- ✅ **Responsive** - Funciona en todos los dispositivos
- ✅ **Moderno** - UI/UX actual y atractivo

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

3. **Configura Formspree:**
   - Ve a [formspree.io](https://formspree.io)
   - Crea formularios para "contacto" y "compra"
   - Copia los endpoints
   - En Netlify: Site settings → Environment variables
   - Agrega:
     - `VITE_FORMSPREE_CONTACTO` = tu endpoint de contacto
     - `VITE_FORMSPREE_COMPRA` = tu endpoint de compra

#### **Opción 2: Deploy Manual**
```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

### **📧 Configuración de Formularios**

#### **Formspree (Recomendado):**
- **Gratuito:** 50 submissions/mes
- **Panel admin:** Ve todos los formularios
- **Anti-spam:** Protección automática
- **Email notifications:** Recibes emails automáticamente

#### **Netlify Forms (Alternativa):**
- **Integrado:** Con Netlify
- **Sin límites:** En plan gratuito
- **Panel admin:** En Netlify dashboard

### **🔧 Variables de Entorno**
```env
VITE_FORMSPREE_CONTACTO=https://formspree.io/f/YOUR_FORM_ID
VITE_FORMSPREE_COMPRA=https://formspree.io/f/YOUR_FORM_ID_2
```

### **📱 Otros Hostings**
- **Vercel** - Similar a Netlify
- **GitHub Pages** - Gratuito, solo frontend
- **Firebase Hosting** - De Google
- **Cualquier hosting estático**

---

**Desarrollado con ❤️ para Facheritos**