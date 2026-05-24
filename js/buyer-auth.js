import { verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';

const loginBtn = document.querySelector('.btn-cta');

verificarEstadoSesion(async (user) => {
    if (user) {
        loginBtn.textContent = 'Administrar Cuenta';
        loginBtn.onclick = async (e) => {
            e.preventDefault();
        };
    } else {
        loginBtn.textContent = 'Inicia sesión';
        loginBtn.href = 'profiles.html';
        loginBtn.onclick = null;
    }
});