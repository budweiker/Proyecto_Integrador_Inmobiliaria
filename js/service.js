import { guardarTestimonio, obtenerTestimonios } from './testimonios.js';

const avatarColor = (nombre) => {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
        hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
};

const iniciales = (nombre) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
};

const crearSkeletons = () => {
    const grid = document.getElementById('testimonios-grid');
    grid.replaceChildren();
    for (let s = 0; s < 3; s++) {
        const card = document.createElement('div');
        card.className = 'skeleton-card';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;gap:12px;align-items:center;margin-bottom:16px;';
        const circle = document.createElement('div');
        circle.className = 'skeleton-line';
        circle.style.cssText = 'width:44px;height:44px;border-radius:50%;flex-shrink:0;';
        const lines = document.createElement('div');
        lines.style.cssText = 'flex:1;';
        const l1 = document.createElement('div');
        l1.className = 'skeleton-line';
        l1.style.cssText = 'height:14px;width:60%;margin-bottom:8px;';
        const l2 = document.createElement('div');
        l2.className = 'skeleton-line';
        l2.style.cssText = 'height:10px;width:35%;';
        lines.append(l1, l2);
        header.append(circle, lines);

        const b1 = document.createElement('div');
        b1.className = 'skeleton-line';
        b1.style.cssText = 'height:12px;width:80%;margin-bottom:10px;';
        const b2 = document.createElement('div');
        b2.className = 'skeleton-line';
        b2.style.cssText = 'height:12px;width:100%;margin-bottom:10px;';
        const b3 = document.createElement('div');
        b3.className = 'skeleton-line';
        b3.style.cssText = 'height:12px;width:65%;';

        card.append(header, b1, b2, b3);
        grid.appendChild(card);
    }
};

const renderizarTestimonios = (lista) => {
    const grid = document.getElementById('testimonios-grid');
    grid.replaceChildren();

    if (lista.length === 0) {
        const vacio = document.createElement('div');
        vacio.className = 'testimonios-vacio';
        vacio.style.gridColumn = '1 / -1';

        const ico = document.createElement('i');
        ico.className = 'fas fa-comment-slash';
        const txt = document.createElement('p');
        txt.textContent = 'Aún no hay testimonios. ¡Sé el primero!';
        vacio.append(ico, txt);
        grid.appendChild(vacio);
        return;
    }

    lista.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonio-card';

        const header = document.createElement('div');
        header.className = 'testimonio-header';

        const avatar = document.createElement('div');
        avatar.className = 'testimonio-avatar';
        avatar.style.background = avatarColor(t.nombre || 'U');
        avatar.textContent = iniciales(t.nombre || 'Usuario');

        const info = document.createElement('div');
        const nombre = document.createElement('p');
        nombre.className = 'testimonio-nombre';
        nombre.textContent = t.nombre || 'Anónimo';
        const fecha = document.createElement('p');
        fecha.className = 'testimonio-fecha';
        fecha.textContent = t.fecha || '';
        info.append(nombre, fecha);

        header.append(avatar, info);
        card.appendChild(header);

        const estrellas = document.createElement('div');
        estrellas.className = 'testimonio-estrellas';
        const rating = Number(t.rating) || 0;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '\u2605';
            star.style.color = i <= rating ? '#f59e0b' : '#d1d5db';
            estrellas.appendChild(star);
        }
        card.appendChild(estrellas);

        const textoP = document.createElement('p');
        textoP.className = 'testimonio-texto';
        const comilla = document.createElement('span');
        comilla.className = 'testimonio-comilla';
        comilla.textContent = '\u201C';
        textoP.appendChild(comilla);
        textoP.appendChild(document.createTextNode(t.texto || ''));
        card.appendChild(textoP);

        grid.appendChild(card);
    });
};

const cargarYRenderizar = async () => {
    crearSkeletons();
    try {
        const lista = await obtenerTestimonios();
        renderizarTestimonios(lista);
    } catch (err) {
        console.error('Error cargando testimonios:', err);
        renderizarTestimonios([]);
    }
};

cargarYRenderizar();

let ratingSeleccionado = 0;
const starBtns = document.querySelectorAll('.rating-star-btn');

starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        const val = Number(btn.dataset.val);
        starBtns.forEach(b => {
            b.style.color = Number(b.dataset.val) <= val ? '#f59e0b' : '#d1d5db';
        });
    });
    btn.addEventListener('mouseleave', () => {
        starBtns.forEach(b => {
            b.style.color = Number(b.dataset.val) <= ratingSeleccionado ? '#f59e0b' : '#d1d5db';
        });
    });
    btn.addEventListener('click', () => {
        ratingSeleccionado = Number(btn.dataset.val);
        const ratingContainer = document.getElementById('rating-stars-container');
        ratingContainer.classList.remove('rating-error');
        starBtns.forEach(b => {
            if (Number(b.dataset.val) <= ratingSeleccionado) {
                b.classList.add('selected');
                b.style.color = '#f59e0b';
            } else {
                b.classList.remove('selected');
                b.style.color = '#d1d5db';
            }
        });
        document.getElementById('error-rating-test').classList.remove('visible');
    });
});

document.getElementById('btn-publicar-test').addEventListener('click', async () => {
    const inputNombre = document.getElementById('input-nombre-test');
    const inputTexto  = document.getElementById('input-texto-test');
    const errNombre   = document.getElementById('error-nombre-test');
    const errTexto    = document.getElementById('error-texto-test');
    const errRating   = document.getElementById('error-rating-test');
    const btn         = document.getElementById('btn-publicar-test');

    const nombre = inputNombre.value.trim();
    const texto  = inputTexto.value.trim();

    let valido = true;
    if (nombre.length < 2) {
        errNombre.classList.add('visible');
        valido = false;
    } else {
        errNombre.classList.remove('visible');
    }
    if (texto.length < 20) {
        errTexto.classList.add('visible');
        valido = false;
    } else {
        errTexto.classList.remove('visible');
    }
    if (ratingSeleccionado === 0) {
        errRating.classList.add('visible');
        document.getElementById('rating-stars-container').classList.add('rating-error');
        valido = false;
    } else {
        errRating.classList.remove('visible');
        document.getElementById('rating-stars-container').classList.remove('rating-error');
    }

    if (!valido) return;

    btn.disabled = true;
    btn.replaceChildren();
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    btn.appendChild(spinner);
    btn.appendChild(document.createTextNode('Publicando...'));

    try {
        await guardarTestimonio({ nombre, texto, rating: ratingSeleccionado });

        inputNombre.value = '';
        inputTexto.value  = '';
        ratingSeleccionado = 0;
        starBtns.forEach(b => {
            b.classList.remove('selected');
            b.style.color = '#e2e8f0';
        });

        const toast = document.getElementById('toast-testimonio');
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 4000);

        await cargarYRenderizar();
    } catch (err) {
        console.error('Error publicando testimonio:', err);
        alert('No se pudo publicar el testimonio. Intenta de nuevo.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Publicar testimonio';
    }
});

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
