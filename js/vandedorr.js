import { verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';

const cuentaBtn = document.querySelector('.btn-cta');

verificarEstadoSesion(async (user) => {
    if (user) {
        cuentaBtn.textContent = 'Cuenta';
        cuentaBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('¿Quieres cerrar sesión?')) {
                import('https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js').then(({ getAuth, signOut }) => {
                    const auth = getAuth();
                    signOut(auth).then(() => {
                        window.location.href = 'home.html';
                    });
                });
            }
        };
    } else {
        cuentaBtn.textContent = 'Inicia sesión';
        cuentaBtn.href = 'profiles.html';
        cuentaBtn.onclick = null;
    }
});