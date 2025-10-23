# 🎬 CineVida - Editor de Video Profesional

Un editor de video completo estilo CapCut/Premiere Pro construido con JavaScript, HTML y CSS puro.

## ✨ Características

- **Timeline Multi-Pista**: 4 pistas editables (Video, Imágenes, Texto, Audio)
- **Drag & Drop**: Arrastra archivos e imágenes fácilmente a la timeline
- **Efectos Visuales**: Brillo, contraste, saturación, blur con controles en tiempo real
- **Transiciones**: Fade, slide, zoom, dissolve entre clips
- **Texto Avanzado**: Plantillas profesionales con personalización completa
- **Preview en Tiempo Real**: Canvas con renderizado instantáneo
- **Exportación**: MP4/WebM en 720p, 1080p o 4K
- **Autoguardado**: Cada 60 segundos automáticamente
- **Deshacer/Rehacer**: Historial de hasta 50 acciones
- **Biblioteca de Imágenes**: Imágenes de stock gratuitas de Unsplash

## 🚀 Inicio Rápido

1. Abre `index.html` en tu navegador para ver la landing page
2. Click en "Comenzar Ahora" para abrir el editor
3. Arrastra imágenes desde la galería o sube las tuyas
4. Arrastra medios desde la biblioteca a la timeline
5. Agrega texto con las plantillas prediseñadas
6. Aplica efectos y transiciones
7. Click en Play para previsualizar
8. Exporta tu video cuando esté listo

## 📁 Archivos del Proyecto

- **index.html** - Landing page principal
- **editor.html** - Editor de video completo
- **tutorial.html** - Tutorial detallado paso a paso
- **styles.css** - Estilos del editor
- **script.js** - Lógica completa del editor
- **README.md** - Este archivo

## 🎨 Cómo Usar

### Subir Archivos
1. Click en "Agregar archivos" o arrastra imágenes/videos
2. Los archivos aparecerán en la biblioteca
3. Usa doble click en imágenes de stock para agregarlas a tu biblioteca

### Agregar a Timeline
1. Arrastra elementos desde la biblioteca a las pistas
2. **Pista Video**: Videos e imágenes grandes
3. **Pista Imágenes**: Imágenes secundarias
4. **Pista Texto**: Títulos, subtítulos, citas
5. **Pista Audio**: Música de fondo

### Editar Clips
- **Mover**: Arrastra el clip horizontalmente
- **Recortar**: Arrastra los bordes del clip
- **Dividir**: Posiciona el playhead y click en <i>dividir</i>
- **Eliminar**: Selecciona y click en <i>eliminar</i>

### Agregar Texto
1. Ve a la pestaña "Texto" en la biblioteca
2. Selecciona una plantilla (Título, Subtítulo, Cita, Pie de foto)
3. El texto aparecerá en la timeline
4. Selecciónalo y edita en el panel de propiedades
5. Ajusta contenido, tamaño, color, fuente y posición vertical

### Aplicar Efectos
1. Selecciona un clip en la timeline
2. Ve al panel de "Efectos" a la derecha
3. **Filtros**: Ajusta brillo, contraste, saturación, blur
4. **Transiciones**: Aplica fade, slide, zoom o dissolve
5. **Animaciones**: Agrega fade in/out, slide in, zoom in

### Reproducción
- **Play/Pause**: Click en el botón o presiona Espacio
- **Stop**: Vuelve al inicio
- **Seek**: Click en la regla de tiempo para saltar

### Exportar
1. Click en "Exportar Video"
2. Selecciona resolución (720p, 1080p, 4K)
3. Elige formato (MP4, WebM)
4. Selecciona calidad (Alta, Media, Baja)
5. Click en "Exportar"

## ⌨️ Atajos de Teclado

- `Espacio` - Play/Pause
- `Ctrl + Z` - Deshacer
- `Ctrl + Y` - Rehacer
- `Delete` - Eliminar clip seleccionado

## 🛠️ Tecnologías

- HTML5 + CSS3 + JavaScript (ES6+)
- Canvas API para renderizado
- MediaRecorder API para exportación
- LocalStorage para persistencia
- Font Awesome 6.4.0 (iconos)
- Google Fonts - Inter
- GSAP 3.12.2 (animaciones)
- Sortable.js 1.15.0 (drag & drop)

## 🐛 Solución de Problemas

### Las imágenes no se muestran
- Asegúrate de arrastrarlas a la timeline
- Verifica que el playhead esté en el rango del clip
- Usa imágenes JPG, PNG o GIF

### El preview está negro
- Agrega al menos un clip a la timeline
- Mueve el playhead a una posición donde haya clips
- Presiona Play para verificar

### Los textos no aparecen
- Verifica que el clip de texto esté en el tiempo actual
- Ajusta la posición vertical en las propiedades
- Cambia el color si el fondo es del mismo tono

### No puedo exportar
- Agrega al menos un clip a la timeline
- Verifica que los clips tengan duración > 0
- Intenta con una resolución más baja si falla

## 📚 Recursos Adicionales

- Ver `tutorial.html` para una guía completa
- Las imágenes de stock provienen de Unsplash (gratuitas)
- Los proyectos se guardan en localStorage del navegador

## 🎯 Características Futuras

- Integración con FFmpeg.js para procesamiento avanzado
- Keyframes para animaciones personalizadas
- Chroma key (pantalla verde)
- Efectos de audio avanzados
- Plantillas de proyecto prediseñadas
- Colaboración en tiempo real

## 📝 Notas

- El proyecto se autoguar da cada 60 segundos
- Los datos se almacenan en localStorage (no se pierden al cerrar)
- Las imágenes de Unsplash son de uso gratuito
- La búsqueda de imágenes funciona con la API de Unsplash

## 📄 Licencia

Proyecto educativo - Libre para uso personal

---

**¡Crea el video de tu proyecto de vida hoy! 🎥✨**

Creado con ❤️ usando solo JavaScript, HTML y CSS
