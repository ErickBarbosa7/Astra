 Guía de Diseño: Pantalla de Login / Registro (Split Layout)

El diseño de la imagen proporcionada sigue un patrón de **Split Screen** (pantalla dividida), muy popular en aplicaciones SaaS modernas. Combina un lado visual/creativo con un lado funcional minimalista.

## 1. Características Principales del Diseño
* **Layout de Pantalla Dividida (50/50 o 55/45):** El contenedor principal se divide en dos columnas. La izquierda es para branding/ilustración y la derecha para el formulario interactivo.
* **Contenedor Principal Flotante:** No ocupa el 100% de la pantalla, sino que es una gran tarjeta centrada con bordes redondeados sobre un fondo oscuro.
* **Formulario Minimalista:** Los *inputs* (campos de texto) no tienen bordes completos, solo un borde inferior (`border-bottom`), dándoles un aspecto visualmente muy limpio.
* **Botones tipo Píldora (Pill-shaped):** Los botones principales tienen un `border-radius` máximo para contrastar con las líneas rectas del formulario.

## 2. Guía de Estilos (Design Tokens)

### Paleta de Colores
* **Fondo Exterior (Body):** `#242426` (Gris oscuro carbón).
* **Fondo Lado Izquierdo (Ilustración):** `#EAEBEB` o `#F3F4F6` (Gris claro).
* **Fondo Lado Derecho (Formulario):** `#FFFFFF` (Blanco puro).
* **Texto Principal:** `#1A1A1A` (Casi negro).
* **Texto Secundario (Subtítulos/Links):** `#71717A` (Gris medio).
* **Botón Principal (Log In):** `#1F2023` o `#111111`.
* **Botón Secundario (Google):** `#F4F4F5`.

*(Opcional: Colores de la ilustración si decides recrearla con CSS o SVG)*
* Morado: `#5B21B6` o `#6D28D9`
* Naranja: `#F97316`
* Amarillo: `#EAB308`

### Tipografía
* **Familia:** *Inter*, *Plus Jakarta Sans* o *Poppins* (para coincidir con el resto de la app).
* **Título ("Welcome back!"):** Bold (700), tamaño grande (ej. 28px - 32px).
* **Labels y Cuerpo:** Medium (500) o Regular (400), tamaño 14px.

## 3. Estructura de Layout (CSS Puro)

### El Contenedor Base
Para centrar el componente flotante en la pantalla:
```css
body {
  background-color: #242426;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 24px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 600px;
  border-radius: 24px;
  overflow: hidden; /* Importante para que los hijos no rompan el borde redondeado */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Lado Izquierdo (Ilustración)
```css
.login-left {
  flex: 1; /* Ocupa la mitad */
  background-color: #EAEBEB;
  display: flex; /* Para centrar la imagen/SVG */
  align-items: flex-end; /* Si la ilustración se apoya en el fondo */
  justify-content: center;
  
  /* Ocultar en móviles */
  @media (max-width: 768px) {
    display: none;
  }
}
```

### Lado Derecho (Formulario)
```css
.login-right {
  flex: 1;
  background-color: #FFFFFF;
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

## 4. Estilos del Formulario

### Campos de Texto (Inputs estilo Línea)
El estilo distintivo aquí es que no tienen fondo ni borde completo.
```css
.input-field {
  width: 100%;
  border: none;
  border-bottom: 2px solid #E4E4E7;
  padding: 8px 0;
  background: transparent;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-bottom-color: #1A1A1A; /* O el color de acento de tu app */
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 4px;
  display: block;
}
```

### Botones
Los botones son anchos y redondeados al máximo.
```css
.btn {
  width: 100%;
  border-radius: 9999px; /* Aspecto de píldora */
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
}

.btn-primary {
  background-color: #1A1A1A;
  color: #FFFFFF;
}

.btn-secondary {
  background-color: #F4F4F5;
  color: #1A1A1A;
  margin-top: 16px;
}
```

## 5. Recomendaciones de Implementación para React/Tailwind
* **Responsividad:** En dispositivos móviles (`< 768px`), la columna izquierda (ilustraciones) debe desaparecer (`hidden md:flex`), y el contenedor principal debe ocupar todo el ancho, tal vez perdiendo sus bordes exteriores o reduciendo su sombra para parecer una pantalla móvil nativa.
* **Ícono de Ojo (Contraseña):** Usa un contenedor relativo para el input y posiciona el ícono de Lucide React (`<Eye />` / `<EyeOff />`) absolutamente a la derecha (`absolute right-0`).
* **Checkbox:** Usa el componente estándar pero personaliza el color de acento para que sea negro o verde oscuro, acorde al estilo minimalista.