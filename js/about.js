import { verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';

const loginBtn = document.querySelector('.btn-cta');

verificarEstadoSesion(async (user) => {
    if (user) {
        loginBtn.textContent = 'Administrar Cuenta';
        loginBtn.onclick = async (e) => {
            e.preventDefault();
            const userData = await obtenerUsuarioActual();
            if (userData && userData.rol === 'Comprador') {
                window.location.href = 'buyer.html';
            } else if (userData && userData.rol === 'Vendedor') {
                window.location.href = 'seller.html';
            } else {
                window.location.href = 'profiles.html';
            }
        };
    } else {
        loginBtn.textContent = 'Inicia sesión';
        loginBtn.href = 'profiles.html';
        loginBtn.onclick = null;
    }
});
