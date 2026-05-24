import { verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';
import { listAllProperties } from './props.js';

const loginBtn = document.querySelector('.btn-cta');
const adminBtn = document.querySelector('.btn-admin-panel');
const propertyGrid = document.getElementById('property-grid');

function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function formatPrice(price) {
    const n = Number(price || 0);
    return '$' + n.toLocaleString('es-CO');
}

function truncate(text, max) {
    if (!text || text.length <= max) return text || '';
    return text.substring(0, max) + '...';
}

function renderProperties(properties) {
    if (!propertyGrid) return;

    if (!properties || properties.length === 0) {
        propertyGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="p-5">
                    <i class="fa fa-building" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
                    <h4 class="text-muted">No hay propiedades disponibles</h4>
                    <p class="text-muted">Pronto publicaremos nuevas propiedades.</p>
                </div>
            </div>
        `;
        return;
    }

    propertyGrid.innerHTML = properties.map(p => {
        const imgSrc = p.imageUrl || 'img/placeholder.png';
        const typeLabel = p.type || 'Propiedad';

        const tipoLower = (p.type || '').toLowerCase();
        return `
            <div class="col-lg-4 col-md-6 mb-4 property-item" data-ubicacion="${escapeHtml(p.location)}" data-tipo="${escapeHtml(tipoLower)}" data-habitaciones="99" data-precio="${Number(p.price || 0)}">
                <div class="property-card bg-white rounded-lg shadow-sm overflow-hidden h-100 d-flex flex-column">
                    <div class="position-relative overflow-hidden property-img" style="height: 250px;">
                        <img class="img-fluid w-100 h-100" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.title)}" style="object-fit:cover;" loading="lazy">
                        <span class="badge-status bg-success text-white position-absolute font-weight-bold px-3 py-1 rounded" style="top:15px;left:15px;">
                            ${escapeHtml(typeLabel)}
                        </span>
                    </div>
                    <div class="p-4 d-flex flex-column flex-grow-1">
                        <h4 class="text-primary font-weight-bold mb-2">${formatPrice(p.price)} <span class="small text-muted font-weight-normal">COP</span></h4>
                        <h5 class="font-weight-bold mb-2 text-dark property-title">${escapeHtml(p.title)}</h5>
                        <p class="text-muted mb-3"><i class="fa fa-map-marker-alt text-primary mr-2"></i>${escapeHtml(p.location)}</p>
                        <p class="text-muted small mb-4 flex-grow-1">${escapeHtml(truncate(p.description, 120))}</p>
                        <div class="mt-auto">
                            <a href="contact.html" class="btn btn-outline-primary btn-block rounded py-2 font-weight-bold">Ver Detalles</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

verificarEstadoSesion(async (user) => {
    if (user) {
        let userData = null;
        try {
            userData = await obtenerUsuarioActual();
        } catch (e) {
            console.error('Error al obtener usuario actual:', e);
        }

        const rol = ((userData && userData.rol) || '').toLowerCase();

        loginBtn.textContent = 'Administrar Cuenta';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (rol === 'comprador') {
                window.location.href = 'buyer.html';
            } else if (rol === 'vendedor') {
                window.location.href = 'seller.html';
            } else if (rol === 'admin' || rol === 'administrador') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'profiles.html';
            }
        };

        if (adminBtn) {
            if (rol === 'admin' || rol === 'administrador') {
                adminBtn.style.display = 'inline-flex';
                adminBtn.style.alignItems = 'center';
                adminBtn.style.gap = '6px';
            } else {
                adminBtn.style.display = 'none';
            }
        }
    } else {
        loginBtn.textContent = 'Inicia sesión';
        loginBtn.href = 'profiles.html';
        loginBtn.onclick = null;
        if (adminBtn) adminBtn.style.display = 'none';
    }

    listAllProperties().then(renderProperties);
});
