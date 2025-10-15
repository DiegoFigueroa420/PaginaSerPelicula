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

    pelic