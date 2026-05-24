import { verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';

const loginBtn = document.querySelector('.btn-cta');
const adminBtn = document.querySelector('.btn-admin-panel');

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
});
