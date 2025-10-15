// Variables globales
let etapas = [];
let selectedEmotion = '';
let projectData = {
    nombre: '',
    edad: '',
    profesion: '',
    metas: {},
    vision: '',
    emocion: '',
    frase: '',
    etapas: [],
    fechaInicio: new Date().toISOString()
};

// Frases motivacionales
const frases = [
    "El futuro pertenece a quienes creen en la belleza de sus sueños - Eleanor Roosevelt",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día - Robert Collier",
    "No importa lo lento que vayas, siempre y cuando no te detengas - Confucio",
    "Tu único límite es tu mente - Desconocido",
    "Los sueños no tienen fecha de caducidad - Desconocido",
    "Cada día es una nueva oportunidad para cambiar tu vida - Desconocido",
    "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora - Proverbio chino",
    "La vida es 10% lo que te sucede y 90% cómo reaccionas a ello - Charles R. Swindoll"
];

// Música mejorada con enlaces de YouTube
const musicOptions = {
    epico: {
        name: "Música Épica Cinematográfica",
        url: "https://www.youtube.com/embed/5g8ykQLYnX0", // Epic Cinematic Music
        thumbnail: "https://img.youtube.com/vi/5g8ykQLYnX0/hqdefault.jpg"
    },
    motivacional: {
        name: "Música Motivacional",
        url: "https://www.youtube.com/embed/WNeLUngb-Xg", // Inspiring Music
        thumbnail: "https://img.youtube.com/vi/WNeLUngb-Xg/hqdefault.jpg"
    },
    relajante: {
        name: "Música Relajante",
        url: "https://www.youtube.com/embed/1ZYbU82GVz4", // Relaxing Music
        thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/hqdefault.jpg"
    },
    energetico: {
        name: "Música Energética",
        url: "https://www.youtube.com/embed/3AtDnEC4zak", // Upbeat Music
        thumbnail: "https://img.youtube.com/vi/3AtDnEC4zak/hqdefault.jpg"
    }
};

// Sistema de logros
const logros = {
    primeraMeta: false,
    cincoEtapas: false,
    peliculaCreada: false,
    proyectoGuardado: false
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        once: true
    });

    // Inicializar cursor personalizado
    initCustomCursor();

    // Inicializar animaciones de scroll
    initScrollAnimations();

    // Actualizar progreso inicial
    updateProgress();

    // Configurar event listeners
    setupEventListeners();

    // Crear partículas de fondo
    setInterval(crearParticula, 300);

    // Cambiar frase motivacional automáticamente
    setInterval(cambiarFraseMotivacional, 10000);

    // Autoguardado
    setInterval(autoguardar, 30000);

    console.log('🎬 CineVida iniciado correctamente');
    console.log('✨ ¡Bienvenido a tu creador de películas de vida!');
});

// Cursor personalizado
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorCircle.style.left = e.clientX - 20 + 'px';
            cursorCircle.style.top = e.clientY - 20 + 'px';
        }, 100);
    });

    // Efectos al pasar sobre elementos interactivos
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, .emotion-btn, .timeline-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(1.5)';
            cursorCircle.style.transform = 'scale(1.2)';
            cursorCircle.style.borderColor = '#FFD700';
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorCircle.style.transform = 'scale(1)';
            cursorCircle.style.borderColor = 'var(--primary-color)';
        });
    });
}

// Animaciones de scroll
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de emoción
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectEmotion(this);
        });
    });

    // Botones principales
    document.getElementById('agregarEtapaBtn').addEventListener('click', agregarEtapa);
    document.getElementById('crearPeliculaBtn').addEventListener('click', crearPelicula);
    document.getElementById('verProgresoBtn').addEventListener('click', verProgreso);
    document.getElementById('guardarProyectoBtn').addEventListener('click', guardarProyectoPDF);
    document.getElementById('cargarProyectoBtn').addEventListener('click', cargarProyecto);
    document.getElementById('compartirBtn').addEventListener('click', compartirRedes);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Selector de música
    document.getElementById('musicGenre').addEventListener('change', function() {
        actualizarReproductorMusica(this.value);
    });

    // Actualizar progreso al cambiar inputs
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', updateProgress);
    });
}

// Función para seleccionar emoción
function selectEmotion(btn) {
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedEmotion = btn.getAttribute('data-emotion');
    updateProgress();
}

// Función para agregar etapa
function agregarEtapa() {
    const etapaText = prompt('Describe esta etapa de tu vida:');
    if (etapaText) {
        const fechaEtapa = prompt('¿Cuándo planeas alcanzar esta etapa? (ej: 2025, En 2 años, etc.)');
        if (fechaEtapa) {
            const etapa = {
                id: Date.now(),
                texto: etapaText,
                fecha: fechaEtapa,
                completada: false
            };
            etapas.push(etapa);
            mostrarEtapa(etapa);
            updateProgress();
            actualizarEstadisticas();

            // Verificar logro de 5 etapas
            if (etapas.length >= 5 && !logros.cincoEtapas) {
                verificarLogro('cincoEtapas');
            }
        }
    }
}

// Función para mostrar etapa en el timeline
function mostrarEtapa(etapa) {
    const timeline = document.getElementById('timeline');
    const etapaDiv = document.createElement('div');
    etapaDiv.className = 'timeline-item scroll-animate';
    etapaDiv.id = `etapa-${etapa.id}`;
    etapaDiv.innerHTML = `
        <h4>${etapa.texto}</h4>
        <p class="mb-2"><i class="bi bi-calendar-event"></i> ${etapa.fecha}</p>
        <div>
            <button class="btn btn-sm btn-success me-1" onclick="marcarEtapaCompletada(${etapa.id})">
                <i class="bi bi-check-circle"></i> Completar
            </button>
            <button class="btn btn-sm btn-warning me-1" onclick="editarEtapa(${etapa.id})">
                <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarEtapa(${etapa.id})">
                <i class="bi bi-trash"></i> Eliminar
            </button>
        </div>
    `;
    timeline.appendChild(etapaDiv);

    // Activar animación
    setTimeout(() => {
        etapaDiv.classList.add('visible');
    }, 100);
}

// Función para marcar etapa como completada
function marcarEtapaCompletada(id) {
    const etapa = etapas.find(e => e.id === id);
    if (etapa) {
        etapa.completada = !etapa.completada;
        const etapaDiv = document.getElementById(`etapa-${id}`);
        if (etapa.completada) {
            etapaDiv.style.opacity = '0.7';
            etapaDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else {
            etapaDiv.style.opacity = '1';
            etapaDiv.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }
        actualizarEstadisticas();
    }
}

// Función para editar etapa
function editarEtapa(id) {
    const etapa = etapas.find(e => e.id === id);
    if (etapa) {
        const nuevoTexto = prompt('Edita esta etapa:', etapa.texto);
        if (nuevoTexto !== null) {
            etapa.texto = nuevoTexto;
            const nuevaFecha = prompt('Edita la fecha:', etapa.fecha);
            if (nuevaFecha !== null) {
                etapa.fecha = nuevaFecha;
                actualizarVistaEtapa(etapa);
            }
        }
    }
}

// Función para actualizar vista de etapa
function actualizarVistaEtapa(etapa) {
    const etapaDiv = document.getElementById(`etapa-${etapa.id}`);
    if (etapaDiv) {
        etapaDiv.querySelector('h4').textContent = etapa.texto;
        etapaDiv.querySelector('p').innerHTML = `<i class="bi bi-calendar-event"></i> ${etapa.fecha}`;
    }
}

// Función para eliminar etapa
function eliminarEtapa(id) {
    if (confirm('¿Estás seguro de eliminar esta etapa?')) {
        etapas = etapas.filter(e => e.id !== id);
        document.getElementById(`etapa-${id}`).remove();
        updateProgress();
        actualizarEstadisticas();
    }
}

// Función para crear película
function crearPelicula() {
    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const profesion = document.getElementById('profesion').value;
    const metaCorto = document.getElementById('metaCorto').value;
    const metaMedio = document.getElementById('metaMedio').value;
    const metaLargo = document.getElementById('metaLargo').value;
    const vision = document.getElementById('vision').value;
    const frase = document.getElementById('frase').value;

    if (!nombre || etapas.length === 0) {
        alert('Por favor, completa tu nombre y agrega al menos una etapa');
        return;
    }

    const moviePreview = document.getElementById('moviePreview');
    const movieContent = document.getElementById('movieContent');

    let peliculaHTML = `
        <div class="text-center p-4 mb-4" style="background: linear-gradient(135deg, #f5f5f5, #e0e0e0); border-radius: 10px;">
            <h1 class="display-4" style="color: var(--secondary-color);">🎬 "${nombre}: Una Historia de Éxito"</h1>
            <p class="lead" style="font-style: italic; color: #666;">Una producción de CineVida</p>
        </div>

        <div class="row mb-4">
            <div class="col-md-6">
                <div class="p-3 mb-3 rounded" style="background: linear-gradient(135deg, #f5f5f5, #e0e0e0);">
                    <h3><i class="bi bi-person-circle"></i> Protagonista</h3>
                    <p><strong>${nombre}</strong>, ${edad} años</p>
                    <p>Profesión: ${profesion}</p>
                    <p>Estado emocional: ${selectedEmotion || 'En proceso de descubrimiento'}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="p-3 mb-3 rounded" style="background: #f0f8ff;">
                    <h3><i class="bi bi-bullseye"></i> El Viaje de las Metas</h3>
                    <p><i class="bi bi-1-circle"></i> <strong>Acto I - El Comienzo (1 año):</strong> ${metaCorto}</p>
                    <p><i class="bi bi-2-circle"></i> <strong>Acto II - El Desarrollo (3-5 años):</strong> ${metaMedio}</p>
                    <p><i class="bi bi-3-circle"></i> <strong>Acto III - El Clímax (10+ años):</strong> ${metaLargo}</p>
                </div>
            </div>
        </div>

        <div class="p-3 mb-4 rounded" style="background: #fff3cd;">
            <h3><i class="bi bi-stars"></i> La Visión</h3>
            <p class="mb-0" style="font-style: italic;">"${vision}"</p>
        </div>

        <div class="p-3 mb-4 rounded" style="background: #d4edda;">
            <h3><i class="bi bi-camera-reels"></i> Escenas de la Vida</h3>
    `;

    etapas.forEach((etapa, index) => {
        const estado = etapa.completada ? '<span class="badge bg-success ms-2">Completada</span>' : '';
        peliculaHTML += `
            <div class="p-3 mb-2 rounded" style="background: white; border-left: 4px solid var(--primary-color);">
                <strong>Escena ${index + 1}:</strong> ${etapa.texto} ${estado}
                <br><small><i class="bi bi-calendar-event"></i> ${etapa.fecha}</small>
            </div>
        `;
    });

    peliculaHTML += `
        </div>
        <div class="text-center p-4 rounded" style="background: linear-gradient(135deg, var(--accent-color), #FFA500);">
            <h3 class="text-white"><i class="bi bi-quote"></i> Frase que Guía el Camino</h3>
            <p class="text-white fs-5 fst-italic">"${frase || 'El futuro está en mis manos'}"</p>
        </div>
        <div class="text-center mt-4">
            <h1 class="display-1">🎬 FIN 🎬</h1>
            <p class="text-muted">Pero esto es solo el comienzo...</p>
        </div>
    `;

    movieContent.innerHTML = peliculaHTML;
    moviePreview.classList.add('show');

    // Animación de aparición
    moviePreview.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Efectos de celebración
    celebrar();

    // Verificar logro
    if (!logros.peliculaCreada) {
        verificarLogro('peliculaCreada');
    }
}

// Función para actualizar progreso
function updateProgress() {
    const inputs = document.querySelectorAll('input, textarea');
    let filled = 0;
    let total = inputs.length + 1; // +1 for emotion

    inputs.forEach(input => {
        if (input.value.trim()) filled++;
    });

    if (selectedEmotion) filled++;

    const percentage = Math.round((filled / total) * 100);
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';

    // Verificar logro de primera meta
    const metaCorto = document.getElementById('metaCorto').value;
    if (metaCorto && !logros.primeraMeta) {
        verificarLogro('primeraMeta');
    }
}

// Función para ver progreso
function verProgreso() {
    const stats = document.getElementById('stats');
    stats.style.display = 'grid';
    actualizarEstadisticas();
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const metas = [
        document.getElementById('metaCorto').value,
        document.getElementById('metaMedio').value,
        document.getElementById('metaLargo').value
    ];
    const metasCompletas = metas.filter(meta => meta).length;

    document.getElementById('totalMetas').textContent = `${metasCompletas}/3`;
    document.getElementById('etapasCreadas').textContent = etapas.length;

    const fechaInicio = new Date(projectData.fechaInicio || new Date());
    const hoy = new Date();
    const dias = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
    document.getElementById('diasTranscurridos').textContent = dias;
}

// Función para guardar proyecto como PDF
function guardarProyectoPDF() {
    const nombre = document.getElementById('nombre').value || 'Usuario';

    // Verificar si jsPDF está disponible
    if (typeof window.jspdf !== 'undefined') {
        const { jsPDF } = window.jspdf;

        // Crear PDF
        const doc = new jsPDF();
        let yPos = 20;

        // Título
        doc.setFontSize(22);
        doc.setTextColor(102, 126, 234);
        doc.text(`"${nombre}: Una Historia de Éxito"`, 105, yPos, { align: 'center' });
        yPos += 15;

        // Subtítulo
        doc.setFontSize(12);
        doc.setTextColor(128, 128, 128);
        doc.text('Una producción de CineVida', 105, yPos, { align: 'center' });
        yPos += 20;

        // Información personal
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('INFORMACIÓN PERSONAL', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.text(`Nombre: ${nombre}`, 20, yPos);
        yPos += 7;
        doc.text(`Edad: ${document.getElementById('edad').value || 'No especificada'}`, 20, yPos);
        yPos += 7;
        doc.text(`Profesión: ${document.getElementById('profesion').value || 'No especificada'}`, 20, yPos);
        yPos += 15;

        // Metas
        doc.setFontSize(16);
        doc.text('METAS Y SUEÑOS', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.text(`• Corto plazo (1 año): ${document.getElementById('metaCorto').value || 'No especificada'}`, 20, yPos);
        yPos += 7;
        doc.text(`• Mediano plazo (3-5 años): ${document.getElementById('metaMedio').value || 'No especificada'}`, 20, yPos);
        yPos += 7;
        doc.text(`• Largo plazo (10+ años): ${document.getElementById('metaLargo').value || 'No especificada'}`, 20, yPos);
        yPos += 15;

        // Visión
        const vision = document.getElementById('vision').value;
        if (vision) {
            doc.setFontSize(16);
            doc.text('VISIÓN DE VIDA', 20, yPos);
            yPos += 10;

            doc.setFontSize(12);
            const visionLines = doc.splitTextToSize(`"${vision}"`, 170);
            doc.text(visionLines, 20, yPos);
            yPos += visionLines.length * 7 + 10;
        }

        // Estado emocional
        if (selectedEmotion) {
            doc.setFontSize(16);
            doc.text('ESTADO EMOCIONAL', 20, yPos);
            yPos += 10;

            doc.setFontSize(12);
            doc.text(selectedEmotion, 20, yPos);
            yPos += 15;
        }

        // Frase motivacional
        const frase = document.getElementById('frase').value;
        if (frase) {
            doc.setFontSize(16);
            doc.text('FRASE MOTIVACIONAL', 20, yPos);
            yPos += 10;

            doc.setFontSize(12);
            doc.text(`"${frase}"`, 20, yPos);
            yPos += 15;
        }

        // Etapas
        if (etapas.length > 0) {
            // Nueva página si es necesario
            if (yPos > 220) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(16);
            doc.text('ETAPAS DEL PROYECTO', 20, yPos);
            yPos += 10;

            doc.setFontSize(12);
            etapas.forEach((etapa, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }

                const estado = etapa.completada ? ' (Completada)' : '';
                doc.text(`${index + 1}. ${etapa.texto}${estado}`, 20, yPos);
                yPos += 7;
                doc.text(`   Fecha: ${etapa.fecha}`, 25, yPos);
                yPos += 10;
            });
        }

        // Guardar PDF
        doc.save(`CineVida_${nombre}_${new Date().toISOString().split('T')[0]}.pdf`);

        mostrarToast('success', '📄 PDF generado exitosamente');

        // Verificar logro
        if (!logros.proyectoGuardado) {
            verificarLogro('proyectoGuardado');
        }
    } else {
        mostrarToast('warning', 'La funcionalidad de PDF requiere la biblioteca jsPDF.');
    }
}

// Función para cargar proyecto
function cargarProyecto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                cargarDatosProyecto(data);
                mostrarToast('success', '✅ ¡Proyecto cargado exitosamente!');
            } catch (error) {
                console.error('Error al cargar el archivo:', error);
                mostrarToast('danger', '❌ Error al cargar el archivo. Asegúrate de que sea un archivo válido de CineVida.');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// Función para cargar datos del proyecto
function cargarDatosProyecto(data) {
    // Cargar datos en los campos
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('edad').value = data.edad || '';
    document.getElementById('profesion').value = data.profesion || '';
    document.getElementById('metaCorto').value = data.metas?.corto || '';
    document.getElementById('metaMedio').value = data.metas?.medio || '';
    document.getElementById('metaLargo').value = data.metas?.largo || '';
    document.getElementById('vision').value = data.vision || '';
    document.getElementById('frase').value = data.frase || '';

    // Cargar etapas
    etapas = data.etapas || [];
    document.getElementById('timeline').innerHTML = '';
    etapas.forEach(etapa => mostrarEtapa(etapa));

    // Cargar emoción seleccionada
    if (data.emocion) {
        selectedEmotion = data.emocion;
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            if (btn.getAttribute('data-emotion') === data.emocion) {
                btn.classList.add('active');
            }
        });
    }

    // Actualizar fecha de inicio si existe
    if (data.fechaInicio) {
        projectData.fechaInicio = data.fechaInicio;
    }

    updateProgress();
}

// Función para compartir en redes
function compartirRedes() {
    const nombre = document.getElementById('nombre').value || 'alguien especial';
    const mensaje = `¡${nombre} está creando su película de vida en CineVida! 🎬✨ Una herramienta increíble para visualizar y planificar el futuro.`;

    if (navigator.share) {
        navigator.share({
            title: 'Mi Película de Vida - CineVida',
            text: mensaje,
            url: window.location.href
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(mensaje + '\n\n' + window.location.href)
            .then(() => {
                mostrarToast('success', '📱 Enlace copiado al portapapeles. ¡Pégalo donde quieras compartirlo!');
            })
            .catch(err => {
                alert('📱 ' + mensaje + '\n\n¡Copia este mensaje y compártelo con tus amigos!');
            });
    }
}

// Función de celebración
function celebrar() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = ['🎉', '🎊', '✨', '🌟', '💫', '🎯', '🏆'][Math.floor(Math.random() * 7)];
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.top = Math.random() * window.innerHeight + 'px';
            document.body.appendChild(emoji);

            setTimeout(() => emoji.remove(), 5000);
        }, i * 100);
    }
}

// Cambiar frase motivacional
function cambiarFraseMotivacional() {
    const quote = document.getElementById('quote');
    quote.textContent = frases[Math.floor(Math.random() * frases.length)];
}

// Actualizar reproductor de música
function actualizarReproductorMusica(genero) {
    const musicPlayer = document.getElementById('musicPlayer');

    if (genero && musicOptions[genero]) {
        const musica = musicOptions[genero];
        let musicHTML = `
            <div class="music-player">
                <div class="music-info">
                    <img src="${musica.thumbnail}" alt="${musica.name}" class="music-thumbnail">
                    <div>
                        <h6 class="mb-0">${musica.name}</h6>
                        <small class="text-muted">Reproduciendo desde YouTube</small>
                    </div>
                </div>
                <div class="ratio ratio-16x9">
                    <iframe src="${musica.url}?autoplay=1&modestbranding=1&rel=0" 
                             frameborder="0" 
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        musicPlayer.innerHTML = musicHTML;
    } else {
        musicPlayer.innerHTML = '';
    }
}

// Crear partículas de fondo
function crearParticula() {
    const particula = document.createElement('div');
    particula.style.position = 'fixed';
    particula.style.width = '4px';
    particula.style.height = '4px';
    particula.style.background = 'rgba(255, 255, 255, 0.8)';
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.top = window.innerHeight + 'px';
    particula.style.zIndex = '1';

    document.body.appendChild(particula);

    let velocidad = 1 + Math.random() * 3;
    let posY = window.innerHeight;

    const animarParticula = setInterval(() => {
        posY -= velocidad;
        particula.style.top = posY + 'px';
        particula.style.opacity = posY / window.innerHeight;

        if (posY < -10) {
            clearInterval(animarParticula);
            particula.remove();
        }
    }, 20);
}

// Verificar logro
function verificarLogro(tipo) {
    if (!logros[tipo]) {
        logros[tipo] = true;
        mostrarLogro(tipo);
    }
}

// Mostrar logro
function mostrarLogro(tipo) {
    const mensajes = {
        primeraMeta: '🏆 ¡Primera Meta Establecida!',
        cincoEtapas: '⭐ ¡5 Etapas Creadas!',
        peliculaCreada: '🎬 ¡Película Creada!',
        proyectoGuardado: '💾 ¡Proyecto Guardado!'
    };

    if (mensajes[tipo]) {
        mostrarToast('info', mensajes[tipo]);
    }
}

// Mostrar toast de Bootstrap
function mostrarToast(tipo, mensaje) {
    // Crear elemento toast
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${tipo} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensaje}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    document.body.appendChild(toastContainer);

    // Inicializar y mostrar toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Eliminar toast después de que se oculte
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastContainer.remove();
    });
}

// Modo oscuro
function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        icon.classList.remove('bi-sun');
        icon.classList.add('bi-moon');
        darkModeToggle.style.background = 'rgba(255, 255, 255, 0.2)';
        darkModeToggle.style.borderColor = 'white';
    } else {
        body.classList.add('dark-mode');
        icon.classList.remove('bi-moon');
        icon.classList.add('bi-sun');
        darkModeToggle.style.background = 'rgba(0, 0, 0, 0.2)';
        darkModeToggle.style.borderColor = '#e9ecef';
    }
}

// Autoguardado
function autoguardar() {
    const nombre = document.getElementById('nombre').value;
    if (nombre && etapas.length > 0) {
        projectData.nombre = nombre;
        projectData.etapas = etapas;
        localStorage.setItem('cineVidaAutoguardado', JSON.stringify(projectData));
    }
}

// Cargar autoguardado al iniciar
function cargarAutoguardado() {
    const autoguardado = localStorage.getItem('cineVidaAutoguardado');
    if (autoguardado) {
        try {
            const data = JSON.parse(autoguardado);
            if (confirm('¿Deseas recuperar tu último proyecto autoguardado?')) {
                cargarDatosProyecto(data);
            }
        } catch (error) {
            console.error('Error al cargar autoguardado:', error);
        }
    }
}

// Llamar a cargar autoguardado al iniciar
window.addEventListener('load', cargarAutoguardado);
