// ============================================
// CINEVIDA - EDITOR DE VIDEO PROFESIONAL
// ============================================

class AudioManager {
    constructor() {
        this.audioElements = new Map();
        this.currentAudio = null;
        this.isAudioPlaying = false;
        this.userInteracted = false;
        
        this.setupAudioInteraction();
    }
    
    setupAudioInteraction() {
        // Permitir reproducción después de la primera interacción del usuario
        const enableAudio = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                console.log('🎵 Audio activado - El usuario ha interactuado con la página');
                
                // Mostrar notificación visual
                if (window.editor && window.editor.showToast) {
                    window.editor.showToast('success', '✅ Audio activado. Ya puedes reproducir música.');
                }
            }
        };
        
        // Escuchar múltiples eventos de interacción
        document.addEventListener('click', enableAudio);
        document.addEventListener('touchstart', enableAudio);
        document.addEventListener('keydown', enableAudio);
        document.addEventListener('mousedown', enableAudio);
    }
    
    async playAudio(url, element) {
        console.log('🔊 Intentando reproducir:', url);
        
        if (!this.userInteracted) {
            console.log('❌ Audio bloqueado - Esperando interacción del usuario');
            if (window.editor && window.editor.showToast) {
                window.editor.showToast('info', '🎵 Haz clic en cualquier parte de la página para activar el audio');
            }
            return false;
        }
        
        // Verificar que la URL sea válida
        if (!url || url === '' || !url.startsWith('http')) {
            console.error('❌ URL de audio inválida:', url);
            if (window.editor && window.editor.showToast) {
                window.editor.showToast('error', '❌ URL de audio no válida');
            }
            return false;
        }
        
        // Si ya está reproduciendo este audio, pausarlo
        if (this.isAudioPlaying && this.currentAudio === url) {
            console.log('⏸️ Pausando audio actual');
            this.pauseAudio();
            if (element) {
                element.querySelector('.play-preview i').className = 'fas fa-play';
                element.classList.remove('playing');
            }
            return true;
        }
        
        // Detener audio actual si hay uno reproduciéndose
        if (this.isAudioPlaying) {
            console.log('🛑 Deteniendo audio anterior');
            this.pauseAudio();
            document.querySelectorAll('.play-preview i').forEach(icon => {
                icon.className = 'fas fa-play';
            });
            document.querySelectorAll('.audio-item.playing').forEach(item => {
                item.classList.remove('playing');
            });
        }
        
        try {
            console.log('🎵 Creando nuevo elemento de audio...');
            
            // Crear nuevo elemento de audio
            const audio = new Audio();
            audio.src = url;
            audio.volume = document.getElementById('volumeSlider') ? 
                          document.getElementById('volumeSlider').value / 100 : 0.7;
            
            // Configurar eventos
            audio.onended = () => {
                console.log('✅ Audio terminado');
                if (element) {
                    element.querySelector('.play-preview i').className = 'fas fa-play';
                    element.classList.remove('playing');
                }
                this.isAudioPlaying = false;
                this.currentAudio = null;
            };
            
            audio.onerror = (e) => {
                console.error('❌ Error de audio:', e);
                if (element) {
                    element.querySelector('.play-preview i').className = 'fas fa-play';
                    element.classList.remove('playing');
                }
                this.isAudioPlaying = false;
                this.currentAudio = null;
                if (window.editor && window.editor.showToast) {
                    window.editor.showToast('error', '❌ Error al reproducir el audio. Intenta con otra canción.');
                }
            };
            
            // Intentar reproducir
            console.log('▶️ Intentando reproducción...');
            await audio.play();
            
            console.log('✅ Audio reproduciéndose correctamente');
            this.audioElements.set(url, audio);
            this.currentAudio = url;
            this.isAudioPlaying = true;
            
            if (element) {
                element.querySelector('.play-preview i').className = 'fas fa-pause';
                element.classList.add('playing');
            }
            
            if (window.editor && window.editor.showToast) {
                window.editor.showToast('success', '🎵 Reproduciendo preview...');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error al reproducir audio:', error);
            if (window.editor && window.editor.showToast) {
                window.editor.showToast('error', '❌ No se pudo reproducir el audio. Intenta con otra canción.');
            }
            return false;
        }
    }
    
    pauseAudio() {
        if (this.currentAudio && this.audioElements.has(this.currentAudio)) {
            const audio = this.audioElements.get(this.currentAudio);
            audio.pause();
            audio.currentTime = 0;
            console.log('⏸️ Audio pausado');
        }
        this.isAudioPlaying = false;
        this.currentAudio = null;
    }
    
    setVolume(volume) {
        this.audioElements.forEach(audio => {
            audio.volume = volume;
        });
        console.log('🔊 Volumen ajustado a:', volume);
    }
    
    // Reproducir audio en la timeline durante la edición
    playTimelineAudio(clip, currentTime) {
        if (!this.userInteracted) return;
        
        const clipStart = clip.startTime;
        const clipEnd = clip.startTime + clip.duration;
        
        // Si el tiempo actual está dentro del rango del clip de audio
        if (currentTime >= clipStart && currentTime <= clipEnd && clip.url) {
            // Si no está reproduciendo o es un audio diferente
            if (!this.isAudioPlaying || this.currentAudio !== clip.url) {
                console.log('🎵 Reproduciendo audio de timeline:', clip.name);
                this.playAudio(clip.url, null);
            }
        } else {
            // Si el tiempo actual está fuera del clip, pausar
            if (this.isAudioPlaying && this.currentAudio === clip.url) {
                this.pauseAudio();
            }
        }
    }
}

class VideoEditor {
    constructor() {
        this.timeline = {
            clips: [],
            duration: 60,
            currentTime: 0,
            zoom: 1,
            playing: false
        };
        
        this.project = {
            name: 'Mi Proyecto de Vida',
            clips: [],
            resolution: { width: 1920, height: 1080 },
            fps: 30
        };
        
        this.mediaLibrary = [];
        this.loadedImages = new Map();
        this.selectedClip = null;
        this.history = {
            past: [],
            future: []
        };
        
        // Sistema de audio mejorado
        this.audioManager = new AudioManager();
        
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupTabs();
        this.loadStockImages();
        this.loadDefaultMusic();
        this.startAutoSave();
        this.renderPreview();
        
        console.log('🎬 CineVida Editor inicializado');
        this.showToast('success', '¡Editor listo! Arrastra imágenes para comenzar');
    }
    
    setupEventListeners() {
        // Top toolbar
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('splitBtn').addEventListener('click', () => this.splitClip());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteClip());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProject());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadProject());
        document.getElementById('exportBtn').addEventListener('click', () => this.openExportModal());
        
        // Upload
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Playback controls
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Timeline controls
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomTimeline(1.5));
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomTimeline(0.67));
        document.getElementById('fitBtn').addEventListener('click', () => this.fitTimeline());
        
        // Panel collapse
        document.getElementById('collapseLeft').addEventListener('click', () => {
            document.querySelector('.left-panel').classList.toggle('collapsed');
        });
        
        document.getElementById('collapseRight').addEventListener('click', () => {
            document.querySelector('.right-panel').classList.toggle('collapsed');
        });
        
        // Export modal
        document.getElementById('closeExportModal').addEventListener('click', () => {
            document.getElementById('exportModal').classList.remove('active');
        });
        
        document.getElementById('cancelExportBtn').addEventListener('click', () => {
            document.getElementById('exportModal').classList.remove('active');
        });
        
        document.getElementById('startExportBtn').addEventListener('click', () => {
            this.exportVideo();
        });
        
        // Filter sliders
        const filterSliders = document.querySelectorAll('.filter-slider');
        filterSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = e.target.parentElement.querySelector('.value');
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
                this.applyFilter(slider.id, e.target.value);
            });
        });
        
        // Effect tabs
        document.querySelectorAll('.effect-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = tab.dataset.effectTab;
                this.switchEffectTab(tabName);
            });
        });
        
        // Transitions
        document.querySelectorAll('[data-transition]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const transition = btn.dataset.transition;
                this.applyTransition(transition);
            });
        });
        
        // Animations
        document.querySelectorAll('[data-animation]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const animation = btn.dataset.animation;
                this.applyAnimation(animation);
            });
        });
        
        // Text presets
        document.querySelectorAll('.text-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const style = btn.dataset.style;
                this.addTextClip(style);
            });
        });
        
        // Stock search
        let searchTimeout;
        document.getElementById('stockSearch').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchStockImages(e.target.value);
            }, 500);
        });
        
        // Timeline ruler click
        document.getElementById('timelineRuler').addEventListener('click', (e) => {
            this.seekTo(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'Delete':
                    e.preventDefault();
                    this.deleteClip();
                    break;
                case 'z':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.undo();
                    }
                    break;
                case 'y':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.redo();
                    }
                    break;
            }
        });
    }
    
    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        uploadArea.addEventListener('dragenter', () => {
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
        
        // Hacer upload area clickeable - SOLUCIÓN AL BUG: prevenir múltiples clics
        let uploadClickInProgress = false;
        uploadArea.addEventListener('click', () => {
            if (!uploadClickInProgress) {
                uploadClickInProgress = true;
                document.getElementById('fileInput').click();
                
                // Resetear después de un tiempo
                setTimeout(() => {
                    uploadClickInProgress = false;
                }, 1000);
            }
        });
        
        // Setup timeline drop zones
        this.setupTimelineDrop();
    }
    
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabName + 'Tab').classList.add('active');
                
                // Si es la pestaña de audio, cargar música
                if (tabName === 'audio') {
                    this.loadDefaultMusic();
                }
            });
        });
    }
    
    async handleFiles(files) {
        if (!files || files.length === 0) return;
        
        console.log(`📁 Procesando ${files.length} archivos...`);
        
        // SOLUCIÓN AL BUG: Usar Set para evitar duplicados
        const uniqueFiles = Array.from(new Set(Array.from(files)));
        
        for (const file of uniqueFiles) {
            if (file.type.startsWith('image/')) {
                await this.addImageFile(file);
            } else if (file.type.startsWith('video/')) {
                await this.addVideoFile(file);
            } else {
                this.showToast('error', `Formato no soportado: ${file.name}`);
            }
        }
    }
    
    async addImageFile(file) {
        // SOLUCIÓN AL BUG: Verificar si el archivo ya existe en la biblioteca
        const existingFile = this.mediaLibrary.find(media => 
            media.name === file.name && media.type === 'image'
        );
        
        if (existingFile) {
            console.log('🔄 Imagen ya existe en la biblioteca:', file.name);
            this.showToast('info', `"${file.name}" ya está en la biblioteca`);
            return;
        }
        
        try {
            const url = await this.readFileAsDataURL(file);
            const img = await this.loadImage(url);
            
            const media = {
                id: this.generateId(),
                type: 'image',
                name: file.name,
                url: url,
                width: img.width,
                height: img.height
            };
            
            this.mediaLibrary.push(media);
            this.loadedImages.set(media.id, img);
            this.renderMediaGrid();
            this.showToast('success', `${file.name} agregado`);
        } catch (error) {
            console.error('Error al cargar imagen:', error);
            this.showToast('error', 'Error al cargar la imagen');
        }
    }
    
    async addVideoFile(file) {
        // SOLUCIÓN AL BUG: Verificar si el archivo ya existe en la biblioteca
        const existingFile = this.mediaLibrary.find(media => 
            media.name === file.name && media.type === 'video'
        );
        
        if (existingFile) {
            console.log('🔄 Video ya existe en la biblioteca:', file.name);
            this.showToast('info', `"${file.name}" ya está en la biblioteca`);
            return;
        }
        
        try {
            const url = await this.readFileAsDataURL(file);
            
            const media = {
                id: this.generateId(),
                type: 'video',
                name: file.name,
                url: url
            };
            
            this.mediaLibrary.push(media);
            this.renderMediaGrid();
            this.showToast('success', `${file.name} agregado`);
        } catch (error) {
            console.error('Error al cargar video:', error);
            this.showToast('error', 'Error al cargar el video');
        }
    }
    
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }
    
    renderMediaGrid() {
        const grid = document.getElementById('mediaGrid');
        grid.innerHTML = '';
        
        this.mediaLibrary.forEach(media => {
            const item = document.createElement('div');
            item.className = 'media-item';
            item.draggable = true;
            item.dataset.mediaId = media.id;
            
            if (media.type === 'image') {
                const img = document.createElement('img');
                img.src = media.url;
                img.alt = media.name;
                item.appendChild(img);
            } else if (media.type === 'video') {
                const video = document.createElement('video');
                video.src = media.url;
                video.muted = true;
                item.appendChild(video);
            }
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMedia(media.id);
            });
            item.appendChild(deleteBtn);
            
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('mediaId', media.id);
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
            
            grid.appendChild(item);
        });
    }
    
    async loadStockImages() {
        const PEXELS_API_KEY = 'MZSwIgZdfwVtcJezqtr2ymGUpe7qRg0ksa5GdB0t6VIl5NxiB9qD4C9m';
        const query = 'nature landscape motivation';
        
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=15`, {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            });
            
            if (!response.ok) throw new Error('Error al cargar imágenes');
            
            const data = await response.json();
            const images = data.photos.map(photo => ({
                url: photo.src.medium,
                name: photo.alt || 'Imagen de stock',
                photographer: photo.photographer
            }));
            
            this.renderStockGrid(images);
        } catch (error) {
            console.error('Error al cargar imágenes de Pexels:', error);
            // Imágenes de respaldo de Unsplash
            const fallbackImages = [
                { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', name: 'Montaña' },
                { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400', name: 'Aurora' },
                { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', name: 'Pico' },
                { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', name: 'Naturaleza' },
                { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', name: 'Bosque' },
                { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', name: 'Niebla' },
                { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400', name: 'Lago' },
                { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', name: 'Atardecer' }
            ];
            this.renderStockGrid(fallbackImages);
        }
    }
    
    renderStockGrid(images) {
        const grid = document.getElementById('stockGrid');
        grid.innerHTML = '';
        
        images.forEach((img) => {
            const item = document.createElement('div');
            item.className = 'stock-item';
            item.draggable = true;
            item.innerHTML = `<img src="${img.url}" alt="${img.name}">`;
            
            item.addEventListener('dragstart', async (e) => {
                // SOLUCIÓN AL BUG: Verificar si la imagen ya existe antes de agregar
                const existingImage = this.mediaLibrary.find(media => 
                    media.url === img.url && media.type === 'image'
                );
                
                if (existingImage) {
                    e.dataTransfer.setData('mediaId', existingImage.id);
                    return;
                }
                
                const media = {
                    id: this.generateId(),
                    type: 'image',
                    name: img.name,
                    url: img.url
                };
                
                try {
                    const loadedImg = await this.loadImage(img.url);
                    media.width = loadedImg.width;
                    media.height = loadedImg.height;
                    this.loadedImages.set(media.id, loadedImg);
                } catch (error) {
                    console.error('Error al precargar imagen:', error);
                }
                
                this.mediaLibrary.push(media);
                e.dataTransfer.setData('mediaId', media.id);
            });
            
            item.addEventListener('dblclick', async () => {
                // SOLUCIÓN AL BUG: Verificar si la imagen ya existe antes de agregar
                const existingImage = this.mediaLibrary.find(media => 
                    media.url === img.url && media.type === 'image'
                );
                
                if (existingImage) {
                    this.showToast('info', `"${img.name}" ya está en la biblioteca`);
                    return;
                }
                
                const media = {
                    id: this.generateId(),
                    type: 'image',
                    name: img.name,
                    url: img.url
                };
                
                try {
                    const loadedImg = await this.loadImage(img.url);
                    media.width = loadedImg.width;
                    media.height = loadedImg.height;
                    this.loadedImages.set(media.id, loadedImg);
                    this.mediaLibrary.push(media);
                    this.renderMediaGrid();
                    this.showToast('success', `${img.name} agregado a biblioteca`);
                } catch (error) {
                    this.showToast('error', 'Error al agregar imagen');
                }
            });
            
            grid.appendChild(item);
        });
    }
    
    async searchStockImages(query) {
        if (!query.trim()) {
            this.loadStockImages();
            return;
        }
        
        const PEXELS_API_KEY = 'MZSwIgZdfwVtcJezqtr2ymGUpe7qRg0ksa5GdB0t6VIl5NxiB9qD4C9m';
        
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`, {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            });
            
            if (!response.ok) throw new Error('Error en búsqueda');
            
            const data = await response.json();
            const images = data.photos.map(photo => ({
                url: photo.src.medium,
                name: photo.alt || query,
                photographer: photo.photographer
            }));
            
            this.renderStockGrid(images);
            this.showToast('success', `${images.length} imágenes encontradas`);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            this.showToast('error', 'Error al buscar imágenes');
        }
    }
    
    async loadDefaultMusic() {
        const audioList = document.getElementById('audioList');
        
        // Limpiar lista existente
        audioList.innerHTML = '';
        
        // Agregar buscador de música
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-box';
        searchContainer.style.marginBottom = '15px';
        searchContainer.innerHTML = `
            <i class="fas fa-search"></i>
            <input type="text" id="musicSearch" placeholder="Buscar música...">
            <div class="audio-notice">
                <i class="fas fa-info-circle"></i> Haz clic en cualquier parte de la página para activar el audio
            </div>
        `;
        audioList.appendChild(searchContainer);
        
        // Event listener para el buscador de música
        let musicSearchTimeout;
        document.getElementById('musicSearch').addEventListener('input', (e) => {
            clearTimeout(musicSearchTimeout);
            musicSearchTimeout = setTimeout(() => {
                this.searchMusic(e.target.value);
            }, 500);
        });
        
        // SIN CANCIONES PREDETERMINADAS - Solo el buscador
        this.renderMusicList([]);
    }
    
    async searchMusic(query) {
        if (!query.trim()) {
            this.loadDefaultMusic();
            return;
        }
        
        try {
            // Primero intentar con música local/búsqueda alternativa
            const localResults = this.getLocalMusicResults(query);
            if (localResults.length > 0) {
                this.renderMusicList(localResults);
                this.showToast('success', `${localResults.length} canciones encontradas`);
                return;
            }
            
            // Fallback a Deezer si no hay resultados locales
            const response = await fetch(`https://corsproxy.io/?url=https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=8`);
            
            if (response.ok) {
                const data = await response.json();
                const tracks = data.data.map(track => ({
                    title: track.title,
                    artist: track.artist.name,
                    preview: track.preview,
                    duration: track.duration,
                    cover: track.album.cover_small,
                    reliable: false
                }));
                
                this.renderMusicList(tracks);
                this.showToast('success', `${tracks.length} canciones encontradas`);
            } else {
                throw new Error('Error en búsqueda de música');
            }
        } catch (error) {
            console.error('Error al buscar música:', error);
            this.showToast('info', 'No se encontraron resultados. Intenta con otros términos.');
            this.renderMusicList([]);
        }
    }
    
    getLocalMusicResults(query) {
        // SIN CANCIONES PREDETERMINADAS - Retornar array vacío
        return [];
    }
    
    renderMusicList(tracks) {
        const audioList = document.getElementById('audioList');
        
        // Mantener el buscador y limpiar solo la lista de canciones
        const searchContainer = audioList.querySelector('.search-box');
        audioList.innerHTML = '';
        if (searchContainer) {
            audioList.appendChild(searchContainer);
        }
        
        if (tracks.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-music"></i>
                <p>No se encontraron canciones</p>
                <p class="search-tips">Usa el buscador para encontrar música</p>
            `;
            audioList.appendChild(noResults);
            return;
        }
        
        tracks.forEach(track => {
            const audioItem = document.createElement('div');
            audioItem.className = 'audio-item';
            if (track.reliable) {
                audioItem.classList.add('reliable');
            }
            
            audioItem.innerHTML = `
                <i class="fas fa-music"></i>
                <div class="track-info">
                    <div class="track-title">${track.title}</div>
                    <div class="track-artist">${track.artist}</div>
                    ${track.reliable ? '<div class="reliable-badge"><i class="fas fa-check"></i> Confiable</div>' : ''}
                </div>
                <button class="play-preview"><i class="fas fa-play"></i></button>
            `;
            
            const playBtn = audioItem.querySelector('.play-preview');
            playBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                console.log('🎵 Click en preview de:', track.title);
                await this.playAudioPreview(track.preview, audioItem);
            });
            
            audioItem.addEventListener('click', () => {
                this.addAudioToTimeline(track);
            });
            
            audioList.appendChild(audioItem);
        });
    }
    
    async playAudioPreview(url, element) {
        return await this.audioManager.playAudio(url, element);
    }
    
    addAudioToTimeline(track) {
        const clip = {
            id: this.generateId(),
            type: 'audio',
            track: 'audioTrack',
            startTime: this.timeline.currentTime,
            duration: 30,
            name: track.title,
            url: track.preview,
            artist: track.artist,
            effects: {},
            reliable: track.reliable || false
        };
        
        this.saveState();
        this.timeline.clips.push(clip);
        this.renderTimeline();
        this.showToast('success', `"${track.title}" agregado a timeline`);
        
        // Reproducir automáticamente al agregar a timeline
        if (this.audioManager.userInteracted) {
            setTimeout(() => {
                this.audioManager.playAudio(track.preview, null);
            }, 100);
        }
    }
    
    setupTimelineDrop() {
        const tracks = {
            'videoTrack': ['image', 'video'],
            'imagesTrack': ['image'],
            'textTrack': ['text'],
            'audioTrack': ['audio']
        };
        
        Object.keys(tracks).forEach(trackId => {
            const track = document.getElementById(trackId);
            
            ['dragover', 'drop'].forEach(eventName => {
                track.addEventListener(eventName, (e) => {
                    e.preventDefault();
                });
            });
            
            track.addEventListener('dragover', (e) => {
                track.style.background = 'rgba(59, 130, 246, 0.1)';
            });
            
            track.addEventListener('dragleave', (e) => {
                track.style.background = '';
            });
            
            track.addEventListener('drop', (e) => {
                track.style.background = '';
                const mediaId = e.dataTransfer.getData('mediaId');
                if (mediaId) {
                    const media = this.mediaLibrary.find(m => m.id === mediaId);
                    if (media) {
                        const rect = track.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pixelsPerSecond = 100 * this.timeline.zoom;
                        const time = Math.max(0, (x / pixelsPerSecond));
                        
                        this.addClipToTimeline(media, trackId, time);
                    }
                }
            });
        });
    }
    
    addClipToTimeline(media, trackId, startTime) {
        const clip = {
            id: this.generateId(),
            mediaId: media.id,
            type: media.type,
            track: trackId,
            startTime: Math.max(0, startTime),
            duration: media.type === 'image' ? 5 : 10,
            name: media.name,
            url: media.url,
            effects: {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                blur: 0
            },
            transition: null,
            animation: null
        };
        
        this.saveState();
        this.timeline.clips.push(clip);
        
        // Actualizar duración de la timeline si es necesario
        const clipEndTime = clip.startTime + clip.duration;
        if (clipEndTime > this.timeline.duration) {
            this.timeline.duration = Math.ceil(clipEndTime / 10) * 10;
        }
        
        this.renderTimeline();
        this.hidePreviewOverlay();
        this.renderPreview();
        this.showToast('success', `"${media.name}" agregado a timeline`);
    }
    
    renderTimeline() {
        const tracks = {
            videoTrack: [],
            imagesTrack: [],
            textTrack: [],
            audioTrack: []
        };
        
        this.timeline.clips.forEach(clip => {
            tracks[clip.track].push(clip);
        });
        
        Object.keys(tracks).forEach(trackId => {
            const trackElement = document.getElementById(trackId);
            trackElement.innerHTML = '';
            
            tracks[trackId].forEach(clip => {
                const clipElement = this.createClipElement(clip);
                trackElement.appendChild(clipElement);
            });
        });
        
        this.updateTimeDisplay();
        this.setupTimelineDrop();
    }
    
    createClipElement(clip) {
        const element = document.createElement('div');
        element.className = 'timeline-clip';
        element.dataset.clipId = clip.id;
        
        const pixelsPerSecond = 100 * this.timeline.zoom;
        element.style.left = (clip.startTime * pixelsPerSecond) + 'px';
        element.style.width = (clip.duration * pixelsPerSecond) + 'px';
        
        if (this.selectedClip && this.selectedClip.id === clip.id) {
            element.classList.add('selected');
        }
        
        let thumbnailHTML = '';
        if (clip.type === 'image' && clip.url) {
            thumbnailHTML = `<img src="${clip.url}" class="clip-thumbnail" alt="${clip.name}">`;
        } else if (clip.type === 'text') {
            thumbnailHTML = '<i class="fas fa-font" style="font-size: 24px; margin-right: 8px;"></i>';
        } else if (clip.type === 'audio') {
            thumbnailHTML = '<i class="fas fa-music" style="font-size: 24px; margin-right: 8px;"></i>';
        }
        
        element.innerHTML = `
            ${thumbnailHTML}
            <div class="clip-info">
                <div class="clip-name">${clip.text || clip.name}</div>
                <div class="clip-duration">${clip.duration.toFixed(1)}s</div>
            </div>
            <div class="resize-handle left"></div>
            <div class="resize-handle right"></div>
        `;
        
        element.addEventListener('click', (e) => {
            if (!e.target.classList.contains('resize-handle')) {
                this.selectClip(clip);
            }
        });
        
        this.makeClipDraggable(element, clip);
        this.makeClipResizable(element, clip);
        
        return element;
    }
    
    makeClipDraggable(element, clip) {
        let isDragging = false;
        let startX = 0;
        let startTime = 0;
        
        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) return;
            
            isDragging = true;
            startX = e.clientX;
            startTime = clip.startTime;
            element.classList.add('dragging');
            
            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const pixelsPerSecond = 100 * this.timeline.zoom;
                const deltaTime = deltaX / pixelsPerSecond;
                
                clip.startTime = Math.max(0, startTime + deltaTime);
                element.style.left = (clip.startTime * pixelsPerSecond) + 'px';
            };
            
            const onMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    element.classList.remove('dragging');
                    this.saveState();
                    this.renderPreview();
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
    
    makeClipResizable(element, clip) {
        const leftHandle = element.querySelector('.resize-handle.left');
        const rightHandle = element.querySelector('.resize-handle.right');
        
        const handleResize = (handle, isLeft) => {
            let isResizing = false;
            let startX = 0;
            let startTime = 0;
            let startDuration = 0;
            
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startTime = clip.startTime;
                startDuration = clip.duration;
                
                const onMouseMove = (e) => {
                    if (!isResizing) return;
                    
                    const deltaX = e.clientX - startX;
                    const pixelsPerSecond = 100 * this.timeline.zoom;
                    const deltaTime = deltaX / pixelsPerSecond;
                    
                    if (isLeft) {
                        const newStartTime = Math.max(0, startTime + deltaTime);
                        const newDuration = startDuration - (newStartTime - startTime);
                        
                        if (newDuration > 0.5) {
                            clip.startTime = newStartTime;
                            clip.duration = newDuration;
                        }
                    } else {
                        const newDuration = Math.max(0.5, startDuration + deltaTime);
                        clip.duration = newDuration;
                    }
                    
                    element.style.left = (clip.startTime * pixelsPerSecond) + 'px';
                    element.style.width = (clip.duration * pixelsPerSecond) + 'px';
                    
                    const durationDisplay = element.querySelector('.clip-duration');
                    if (durationDisplay) {
                        durationDisplay.textContent = clip.duration.toFixed(1) + 's';
                    }
                };
                
                const onMouseUp = () => {
                    if (isResizing) {
                        isResizing = false;
                        this.saveState();
                        this.updatePropertiesPanel();
                        this.renderPreview();
                    }
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        };
        
        handleResize(leftHandle, true);
        handleResize(rightHandle, false);
    }
    
    selectClip(clip) {
        this.selectedClip = clip;
        this.renderTimeline();
        this.updatePropertiesPanel();
    }
    
    updatePropertiesPanel() {
        const content = document.getElementById('propertiesContent');
        
        if (!this.selectedClip) {
            content.innerHTML = `
                <div class="no-selection">
                    <i class="fas fa-hand-pointer"></i>
                    <p>Selecciona un elemento para editar sus propiedades</p>
                </div>
            `;
            return;
        }
        
        const clip = this.selectedClip;
        
        let specificProperties = '';
        
        if (clip.type === 'text') {
            specificProperties = `
                <div class="property-group">
                    <h4><i class="fas fa-font"></i> Texto</h4>
                    <div class="property-item">
                        <label>Contenido</label>
                        <input type="text" value="${clip.text || ''}" id="clipText">
                    </div>
                    <div class="property-item">
                        <label>Tamaño de fuente</label>
                        <input type="number" value="${clip.fontSize || 48}" min="12" max="200" id="fontSize">
                    </div>
                    <div class="property-item">
                        <label>Color</label>
                        <input type="color" value="${clip.color || '#ffffff'}" id="textColor">
                    </div>
                    <div class="property-item">
                        <label>Fuente</label>
                        <select id="fontFamily">
                            <option value="Inter" ${clip.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                            <option value="Arial" ${clip.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                            <option value="Georgia" ${clip.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                            <option value="Impact" ${clip.fontFamily === 'Impact' ? 'selected' : ''}>Impact</option>
                        </select>
                    </div>
                    <div class="property-item">
                        <label>Posición Y (%)</label>
                        <input type="range" value="${clip.positionY || 50}" min="0" max="100" id="positionY">
                        <span id="positionYValue">${clip.positionY || 50}%</span>
                    </div>
                </div>
            `;
        }
        
        content.innerHTML = `
            <div class="property-group">
                <h4><i class="fas fa-info-circle"></i> Información</h4>
                <div class="property-item">
                    <label>Nombre</label>
                    <input type="text" value="${clip.name}" id="clipName">
                </div>
                <div class="property-item">
                    <label>Inicio (s)</label>
                    <input type="number" value="${clip.startTime.toFixed(2)}" step="0.1" id="clipStart">
                </div>
                <div class="property-item">
                    <label>Duración (s)</label>
                    <input type="number" value="${clip.duration.toFixed(2)}" step="0.1" min="0.1" id="clipDuration">
                </div>
            </div>
            ${specificProperties}
        `;
        
        // Event listeners
        const handlers = {
            'clipName': (e) => { clip.name = e.target.value; this.renderTimeline(); },
            'clipStart': (e) => { clip.startTime = parseFloat(e.target.value) || 0; this.renderTimeline(); },
            'clipDuration': (e) => { clip.duration = Math.max(0.1, parseFloat(e.target.value) || 1); this.renderTimeline(); },
            'clipText': (e) => { clip.text = e.target.value; this.renderPreview(); },
            'fontSize': (e) => { clip.fontSize = parseInt(e.target.value) || 48; this.renderPreview(); },
            'textColor': (e) => { clip.color = e.target.value; this.renderPreview(); },
            'fontFamily': (e) => { clip.fontFamily = e.target.value; this.renderPreview(); },
            'positionY': (e) => { 
                clip.positionY = parseInt(e.target.value);
                const valueDisplay = document.getElementById('positionYValue');
                if (valueDisplay) valueDisplay.textContent = clip.positionY + '%';
                this.renderPreview();
            }
        };
        
        Object.keys(handlers).forEach(id => {
            const element = content.querySelector('#' + id);
            if (element) {
                element.addEventListener('input', handlers[id]);
            }
        });
    }
    
    addTextClip(style) {
        const styles = {
            title: { text: 'Título Principal', fontSize: 72, color: '#ffffff', positionY: 30 },
            subtitle: { text: 'Subtítulo', fontSize: 48, color: '#ffffff', positionY: 50 },
            caption: { text: 'Pie de foto', fontSize: 32, color: '#ffffff', positionY: 80 },
            quote: { text: '"Cita inspiradora"', fontSize: 56, color: '#ffd700', positionY: 50 }
        };
        
        const styleData = styles[style];
        
        const clip = {
            id: this.generateId(),
            type: 'text',
            track: 'textTrack',
            startTime: this.timeline.currentTime,
            duration: 5,
            name: styleData.text,
            text: styleData.text,
            fontSize: styleData.fontSize,
            color: styleData.color,
            fontFamily: 'Inter',
            positionY: styleData.positionY,
            effects: {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                blur: 0
            }
        };
        
        this.saveState();
        this.timeline.clips.push(clip);
        this.renderTimeline();
        this.selectClip(clip);
        this.hidePreviewOverlay();
        this.renderPreview();
        this.showToast('success', 'Texto agregado');
    }
    
    togglePlay() {
        if (this.timeline.playing) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.timeline.playing = true;
        const playBtn = document.getElementById('playBtn');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        const startTime = performance.now();
        const initialTime = this.timeline.currentTime;
        
        const animate = (currentTime) => {
            if (!this.timeline.playing) return;
            
            const elapsed = (currentTime - startTime) / 1000;
            this.timeline.currentTime = initialTime + elapsed;
            
            // Reproducir audio de la timeline durante la edición
            this.timeline.clips.forEach(clip => {
                if (clip.type === 'audio') {
                    this.audioManager.playTimelineAudio(clip, this.timeline.currentTime);
                }
            });
            
            if (this.timeline.currentTime >= this.timeline.duration) {
                this.timeline.currentTime = 0;
                this.pause();
                return;
            }
            
            this.updateTimeDisplay();
            this.updatePlayhead();
            this.renderPreview();
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    pause() {
        this.timeline.playing = false;
        const playBtn = document.getElementById('playBtn');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Pausar todo el audio al pausar la timeline
        this.audioManager.pauseAudio();
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    stop() {
        this.pause();
        this.timeline.currentTime = 0;
        this.updateTimeDisplay();
        this.updatePlayhead();
        this.renderPreview();
    }
    
    seekTo(e) {
        const ruler = document.getElementById('timelineRuler');
        const rect = ruler.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        
        this.timeline.currentTime = Math.max(0, Math.min(this.timeline.duration, percent * this.timeline.duration));
        this.updateTimeDisplay();
        this.updatePlayhead();
        this.renderPreview();
    }
    
    updateTimeDisplay() {
        const currentTimeEl = document.getElementById('currentTime');
        const totalTimeEl = document.getElementById('totalTime');
        
        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(this.timeline.currentTime);
        if (totalTimeEl) totalTimeEl.textContent = this.formatTime(this.timeline.duration);
    }
    
    updatePlayhead() {
        const playhead = document.getElementById('playhead');
        const percent = (this.timeline.currentTime / this.timeline.duration) * 100;
        if (playhead) playhead.style.left = Math.min(100, Math.max(0, percent)) + '%';
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    async renderPreview() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Limpiar canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Obtener clips visibles en el tiempo actual
        const currentClips = this.timeline.clips.filter(clip => {
            return this.timeline.currentTime >= clip.startTime && 
                   this.timeline.currentTime < clip.startTime + clip.duration;
        });
        
        // Ordenar por tipo de pista (imágenes/video primero, texto después)
        const sortedClips = currentClips.sort((a, b) => {
            const order = { 'image': 0, 'video': 1, 'text': 2 };
            return (order[a.type] || 0) - (order[b.type] || 0);
        });
        
        // Renderizar cada clip
        for (const clip of sortedClips) {
            if (clip.type === 'image') {
                await this.drawImageClip(ctx, clip);
            } else if (clip.type === 'text') {
                this.drawTextClip(ctx, clip);
            }
        }
    }
    
    async drawImageClip(ctx, clip) {
        try {
            let img = this.loadedImages.get(clip.mediaId);
            
            if (!img && clip.url) {
                img = await this.loadImage(clip.url);
                this.loadedImages.set(clip.mediaId, img);
            }
            
            if (!img) return;
            
            const canvas = this.canvas;
            
            ctx.save();
            
            // Aplicar filtros
            if (clip.effects) {
                ctx.filter = this.buildFilterString(clip.effects);
            }
            
            // Calcular escala para cubrir todo el canvas manteniendo aspecto
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            ctx.restore();
        } catch (error) {
            console.error('Error al dibujar imagen:', error);
        }
    }
    
    drawTextClip(ctx, clip) {
        ctx.save();
        
        const fontSize = clip.fontSize || 48;
        const fontFamily = clip.fontFamily || 'Inter';
        const color = clip.color || '#ffffff';
        const text = clip.text || '';
        const positionY = clip.positionY || 50;
        
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Sombra para mejor legibilidad
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        const x = this.canvas.width / 2;
        const y = (this.canvas.height * positionY) / 100;
        
        ctx.fillText(text, x, y);
        
        ctx.restore();
    }
    
    buildFilterString(effects) {
        const filters = [];
        
        if (effects.brightness !== 0) {
            filters.push(`brightness(${1 + effects.brightness / 100})`);
        }
        if (effects.contrast !== 0) {
            filters.push(`contrast(${1 + effects.contrast / 100})`);
        }
        if (effects.saturation !== 0) {
            filters.push(`saturate(${1 + effects.saturation / 100})`);
        }
        if (effects.blur > 0) {
            filters.push(`blur(${effects.blur}px)`);
        }
        
        return filters.length > 0 ? filters.join(' ') : 'none';
    }
    
    applyFilter(filterId, value) {
        if (!this.selectedClip) {
            this.showToast('error', 'Selecciona un clip primero');
            return;
        }
        
        const filterMap = {
            'brightnessSlider': 'brightness',
            'contrastSlider': 'contrast',
            'saturationSlider': 'saturation',
            'blurSlider': 'blur'
        };
        
        const filterName = filterMap[filterId];
        if (filterName && this.selectedClip.effects) {
            this.selectedClip.effects[filterName] = parseFloat(value);
            this.renderPreview();
            this.saveState();
        }
    }
    
    applyTransition(transitionType) {
        if (!this.selectedClip) {
            this.showToast('error', 'Selecciona un clip primero');
            return;
        }
        
        this.selectedClip.transition = transitionType;
        this.showToast('success', `Transición ${transitionType} aplicada`);
        this.saveState();
    }
    
    applyAnimation(animationType) {
        if (!this.selectedClip) {
            this.showToast('error', 'Selecciona un clip primero');
            return;
        }
        
        this.selectedClip.animation = animationType;
        this.showToast('success', `Animación ${animationType} aplicada`);
        this.saveState();
    }
    
    switchEffectTab(tabName) {
        document.querySelectorAll('.effect-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.effect-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-effect-tab="${tabName}"]`);
        const activeContent = document.getElementById(tabName + 'Content');
        
        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }
    
    splitClip() {
        if (!this.selectedClip) {
            this.showToast('error', 'Selecciona un clip primero');
            return;
        }
        
        const clip = this.selectedClip;
        const splitPoint = this.timeline.currentTime - clip.startTime;
        
        if (splitPoint <= 0 || splitPoint >= clip.duration) {
            this.showToast('error', 'El playhead debe estar dentro del clip');
            return;
        }
        
        const newClip = JSON.parse(JSON.stringify(clip));
        newClip.id = this.generateId();
        newClip.startTime = clip.startTime + splitPoint;
        newClip.duration = clip.duration - splitPoint;
        
        clip.duration = splitPoint;
        
        this.saveState();
        this.timeline.clips.push(newClip);
        this.renderTimeline();
        this.showToast('success', 'Clip dividido');
    }
    
    deleteClip() {
        if (!this.selectedClip) {
            this.showToast('error', 'Selecciona un clip primero');
            return;
        }
        
        this.saveState();
        this.timeline.clips = this.timeline.clips.filter(c => c.id !== this.selectedClip.id);
        this.selectedClip = null;
        this.renderTimeline();
        this.updatePropertiesPanel();
        this.renderPreview();
        this.showToast('success', 'Clip eliminado');
    }
    
    deleteMedia(mediaId) {
        this.mediaLibrary = this.mediaLibrary.filter(m => m.id !== mediaId);
        this.loadedImages.delete(mediaId);
        this.renderMediaGrid();
        this.showToast('success', 'Archivo eliminado');
    }
    
    zoomTimeline(factor) {
        this.timeline.zoom *= factor;
        this.timeline.zoom = Math.max(0.1, Math.min(5, this.timeline.zoom));
        this.renderTimeline();
    }
    
    fitTimeline() {
        this.timeline.zoom = 1;
        this.renderTimeline();
    }
    
    saveState() {
        const state = JSON.stringify({
            clips: this.timeline.clips,
            currentTime: this.timeline.currentTime
        });
        
        this.history.past.push(state);
        this.history.future = [];
        
        if (this.history.past.length > 50) {
            this.history.past.shift();
        }
    }
    
    undo() {
        if (this.history.past.length === 0) {
            this.showToast('info', 'No hay acciones para deshacer');
            return;
        }
        
        const currentState = JSON.stringify({
            clips: this.timeline.clips,
            currentTime: this.timeline.currentTime
        });
        
        this.history.future.push(currentState);
        
        const previousState = JSON.parse(this.history.past.pop());
        this.timeline.clips = previousState.clips;
        this.timeline.currentTime = previousState.currentTime;
        
        this.renderTimeline();
        this.renderPreview();
        this.showToast('success', 'Acción deshecha');
    }
    
    redo() {
        if (this.history.future.length === 0) {
            this.showToast('info', 'No hay acciones para rehacer');
            return;
        }
        
        const currentState = JSON.stringify({
            clips: this.timeline.clips,
            currentTime: this.timeline.currentTime
        });
        
        this.history.past.push(currentState);
        
        const nextState = JSON.parse(this.history.future.pop());
        this.timeline.clips = nextState.clips;
        this.timeline.currentTime = nextState.currentTime;
        
        this.renderTimeline();
        this.renderPreview();
        this.showToast('success', 'Acción rehecha');
    }
    
    saveProject() {
        const projectName = document.getElementById('projectName').value || 'Mi Proyecto';
        
        const projectData = {
            name: projectName,
            clips: this.timeline.clips,
            mediaLibrary: this.mediaLibrary,
            duration: this.timeline.duration,
            resolution: this.project.resolution,
            fps: this.project.fps
        };
        
        localStorage.setItem('cinevida_project', JSON.stringify(projectData));
        localStorage.setItem('cinevida_project_name', projectName);
        
        this.showToast('success', `Proyecto "${projectName}" guardado`);
    }
    
    loadProject() {
        const savedProject = localStorage.getItem('cinevida_project');
        
        if (!savedProject) {
            this.showToast('error', 'No hay proyecto guardado');
            return;
        }
        
        try {
            const projectData = JSON.parse(savedProject);
            
            this.timeline.clips = projectData.clips || [];
            this.mediaLibrary = projectData.mediaLibrary || [];
            this.timeline.duration = projectData.duration || 60;
            
            const projectName = localStorage.getItem('cinevida_project_name');
            if (projectName) {
                document.getElementById('projectName').value = projectName;
            }
            
            // Precargar todas las imágenes
            this.loadedImages.clear();
            this.mediaLibrary.forEach(async (media) => {
                if (media.type === 'image' && media.url) {
                    try {
                        const img = await this.loadImage(media.url);
                        this.loadedImages.set(media.id, img);
                    } catch (error) {
                        console.error('Error al cargar imagen del proyecto:', error);
                    }
                }
            });
            
            this.renderTimeline();
            this.renderMediaGrid();
            this.renderPreview();
            
            this.showToast('success', 'Proyecto cargado');
        } catch (error) {
            console.error('Error al cargar proyecto:', error);
            this.showToast('error', 'Error al cargar el proyecto');
        }
    }
    
    startAutoSave() {
        setInterval(() => {
            if (this.timeline.clips.length > 0) {
                this.saveProject();
                console.log('✅ Autoguardado realizado');
            }
        }, 60000);
    }
    
    openExportModal() {
        if (this.timeline.clips.length === 0) {
            this.showToast('error', 'Agrega clips antes de exportar');
            return;
        }
        
        document.getElementById('exportModal').classList.add('active');
    }
    
    async exportVideo() {
        const resolution = document.getElementById('resolutionSelect').value;
        const format = document.getElementById('formatSelect').value;
        
        document.getElementById('exportProgress').style.display = 'block';
        document.getElementById('startExportBtn').disabled = true;
        
        this.showToast('info', 'Iniciando exportación...');
        
        // Simulación de progreso
        for (let i = 0; i <= 100; i += 10) {
            await this.sleep(500);
            document.getElementById('progressFill').style.width = i + '%';
            document.getElementById('progressText').textContent = `Exportando... ${i}%`;
        }
        
        try {
            const blob = await this.renderVideoToBlob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `cinevida_${Date.now()}.${format}`;
            link.click();
            
            this.showToast('success', '¡Video exportado exitosamente!');
        } catch (error) {
            console.error('Error al exportar:', error);
            this.showToast('error', 'Error al exportar el video');
        }
        
        document.getElementById('exportModal').classList.remove('active');
        document.getElementById('exportProgress').style.display = 'none';
        document.getElementById('startExportBtn').disabled = false;
    }
    
    async renderVideoToBlob() {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 8000000
        });
        
        const chunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };
        
        return new Promise((resolve) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };
            
            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
            }, 3000);
        });
    }
    
    hidePreviewOverlay() {
        const overlay = document.getElementById('previewOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
    
    setVolume(volume) {
        this.audioManager.setVolume(volume);
    }
    
    showToast(type, message) {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    generateId() {
        return 'clip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar editor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.editor = new VideoEditor();
});