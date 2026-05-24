import { verificarEstadoSesion, obtenerUsuarioActual, cerrarSesion } from './auth.js';
import { addProperty, updateProperty, deleteProperty, listPropertiesByUser } from './props.js';

lucide.createIcons();

const form = document.getElementById('formCasa');
const lista = document.getElementById('listaCasas');
const submitBtn = document.getElementById('submitPropBtn');
const searchInput = document.getElementById('buscarPropiedad');

// Elementos del Dropzone
const dropZone = document.getElementById('foto-drag-drop');
const fileInput = document.getElementById('foto');
const previewContainer = document.getElementById('foto-preview-container');
const previewImg = document.getElementById('foto-preview');
const removeBtn = document.getElementById('btn-remove-foto');
const dropMsg = dropZone ? dropZone.querySelector('.drag-drop-msg') : null;

let currentUser = null;
let loadedProperties = [];
let selectedFile = null;

// Inicialización de la sesión
verificarEstadoSesion(async (user) => {
    if (!user) {
        window.location.href = 'profiles.html';
        return;
    }
    currentUser = await obtenerUsuarioActual();
    await refreshList();
    
    // Llenar información del perfil lateral
    const pn = document.getElementById('profileName');
    const pe = document.getElementById('profileEmail');
    const pa = document.getElementById('profileAvatar');
    const wn = document.getElementById('welcomeName');
    if (currentUser) {
        const displayName = currentUser.nombre || currentUser.displayName || (currentUser.email || 'Usuario');
        pn.textContent = displayName;
        pe.textContent = currentUser.email || '';
        if (wn) wn.textContent = displayName.split(' ')[0];
        if (currentUser.avatar) pa.src = currentUser.avatar;
    }
    
    const logout = document.getElementById('logoutBtn');
    if (logout) {
        logout.onclick = async (e) => {
            e.preventDefault();
            await cerrarSesion();
            window.location.href = 'home.html';
        };
    }
});

// Lógica de Drag-and-Drop
if (dropZone && fileInput) {
    // Click en la zona abre el selector
    dropZone.addEventListener('click', (e) => {
        // Evitar que el botón de remover active el selector
        if (e.target.closest('#btn-remove-foto')) return;
        fileInput.click();
    });

    // Cambio del input de archivo
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    });

    // Eventos drag
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => {
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    });
}

if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetDropZone();
    });
}

function handleFileSelect(file) {
    if (!file || !file.type.startsWith('image/')) {
        mostrarNotificacion('Por favor selecciona una imagen válida', 'error');
        return;
    }
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewContainer.classList.remove('d-none');
        if (dropMsg) dropMsg.classList.add('d-none');
    };
    reader.readAsDataURL(file);
}

function resetDropZone() {
    selectedFile = null;
    fileInput.value = '';
    if (previewContainer) previewContainer.classList.add('d-none');
    if (previewImg) previewImg.src = '';
    if (dropMsg) dropMsg.classList.remove('d-none');
}

// Búsqueda en tiempo real
if (searchInput) {
    searchInput.addEventListener('input', filterAndRenderProps);
}

async function refreshList() {
    if (!currentUser) return;
    const props = await listPropertiesByUser(currentUser.id);
    loadedProperties = props || [];
    filterAndRenderProps();
    const pc = document.getElementById('propCount');
    if (pc) pc.textContent = String(loadedProperties.length);
    const st = document.getElementById('statPropCount');
    if (st) st.textContent = String(loadedProperties.length);
}

function filterAndRenderProps() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const filtered = loadedProperties.filter(p => {
        const title = (p.title || p.titulo || '').toLowerCase();
        const location = (p.location || p.ubicacion || '').toLowerCase();
        const description = (p.description || p.descripcion || '').toLowerCase();
        return title.includes(query) || location.includes(query) || description.includes(query);
    });
    renderProps(filtered);
}

function renderProps(props) {
    lista.innerHTML = '';
    if (!props.length) {
        lista.innerHTML = '<div class="col-12"><div class="alert alert-light text-center">No se encontraron propiedades.</div></div>';
        return;
    }
    props.slice().reverse().forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4 fade-in';
        col.innerHTML = `
            <div class="card card-clean p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                    <div class="position-relative overflow-hidden rounded mb-3">
                        <img src="${p.imageUrl || p.image || 'img/placeholder.png'}" class="prop-img img-fluid" alt="${escapeHtml(p.title)}">
                        <span class="badge badge-primary position-absolute price-badge font-weight-bold" style="top: 10px; right: 10px; font-size: 0.95rem; padding: 6px 12px; border-radius: 20px;">
                            $${Number(p.price || p.precio || 0).toLocaleString()}
                        </span>
                    </div>
                    <h5 class="font-weight-bold text-dark mb-1 text-truncate">${escapeHtml(p.title || p.titulo || '')}</h5>
                    <div class="small-muted mb-2 d-flex align-items-center" style="gap: 8px; flex-wrap: wrap;">
                        <span><i data-lucide="map-pin" style="width:14px;height:14px;vertical-align:middle;" class="text-primary"></i> ${escapeHtml(p.location || p.ubicacion || '')}</span>
                        ${p.type ? `<span class="badge badge-light" style="background:#eff6ff;color:#2563eb;font-size:0.7rem;padding:2px 10px;border-radius:20px;">${escapeHtml(p.type)}</span>` : ''}
                    </div>
                    <p class="text-muted small text-clamp-3">${escapeHtml(p.description || p.descripcion || '')}</p>
                </div>
                <div class="d-flex justify-content-end actions-btns border-top pt-3 mt-3">
                    <button class="btn btn-sm btn-outline-primary btn-edit mr-2" data-id="${p.id}"><i class="fa fa-edit mr-1"></i>Editar</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${p.id}"><i class="fa fa-trash mr-1"></i>Borrar</button>
                </div>
            </div>
        `;
        lista.appendChild(col);
    });

    // Re-inicializar iconos Lucide en el catálogo
    if (window.lucide) {
        window.lucide.createIcons();
    }

    document.querySelectorAll('.btn-delete').forEach(b => b.onclick = onDelete);
    document.querySelectorAll('.btn-edit').forEach(b => b.onclick = onEdit);
}

function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

async function onDelete(e) {
    const id = e.currentTarget.dataset.id;
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad permanentemente?')) return;
    try {
        await deleteProperty(id);
        mostrarNotificacion('Propiedad eliminada correctamente', 'success');
        await refreshList();
    } catch (err) {
        console.error(err);
        mostrarNotificacion('Error al eliminar la propiedad', 'error');
    }
}

async function onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const p = loadedProperties.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById('propId').value = p.id;
    document.getElementById('titulo').value = p.title || p.titulo || '';
    document.getElementById('ubicacion').value = p.location || p.ubicacion || '';
    document.getElementById('precio').value = p.price || p.precio || '';
    document.getElementById('tipo').value = p.type || p.tipo || '';
    document.getElementById('descripcion').value = p.description || p.descripcion || '';
    
    // Cargar imagen en la vista previa del dropzone si existe
    if (p.imageUrl || p.image) {
        previewImg.src = p.imageUrl || p.image;
        previewContainer.classList.remove('d-none');
        if (dropMsg) dropMsg.classList.add('d-none');
    } else {
        resetDropZone();
    }
    
    submitBtn.textContent = 'Guardar cambios';
    
    // Activar pestaña "Publicar Propiedad" simulando click en el menú lateral
    const publishTabLink = document.querySelector('.sidebar-menu a[href="#publicar"]');
    if (publishTabLink) {
        publishTabLink.click();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    console.log('[seller] submit disparado');
    if (!currentUser) {
        mostrarNotificacion('Usuario no autenticado. Inicia sesión de nuevo.', 'error');
        return;
    }
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin mr-1"></i> Guardando...';

    const id = document.getElementById('propId').value || null;
    const title = document.getElementById('titulo').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const precio = Number(document.getElementById('precio').value) || 0;
    const descripcion = document.getElementById('descripcion').value.trim();
    const tipo = document.getElementById('tipo').value;

    if (!title || !ubicacion || !precio) {
        mostrarNotificacion('Completa título, ubicación y precio', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = id ? 'Guardar cambios' : 'Publicar propiedad';
        return;
    }

    const payload = {
        title,
        location: ubicacion,
        price: precio,
        type: tipo,
        description: descripcion,
        file: selectedFile || null
    };
    payload.ownerId = currentUser.id;
    console.log('[seller] payload preparado', { title, ubicacion, precio, tipo, file: !!selectedFile });

    try {
        if (id) {
            await updateProperty(id, payload);
            mostrarNotificacion('Propiedad actualizada con éxito', 'success');
        } else {
            await addProperty(currentUser.id, payload);
            mostrarNotificacion('Propiedad publicada con éxito', 'success');
        }
        
        form.reset();
        document.getElementById('propId').value = '';
        resetDropZone();
        submitBtn.textContent = 'Publicar propiedad';
        
        const propsTabLink = document.querySelector('.sidebar-menu a[href="#mispropiedades"]');
        if (propsTabLink) {
            propsTabLink.click();
        }
        
        await refreshList();
    } catch (err) {
        console.error('[seller] error al guardar:', err);
        const msg = err.message || err.code || 'Error desconocido';
        mostrarNotificacion('Error: ' + msg, 'error');
    } finally {
        submitBtn.disabled = false;
    }
});

// Función auxiliar para notificaciones rápidas
function mostrarNotificacion(mensaje, tipo) {
    if (typeof window.mostrarToast === 'function') {
        window.mostrarToast(mensaje, tipo);
    } else {
        alert(`${tipo.toUpperCase()}: ${mensaje}`);
    }
}
