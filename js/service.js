import { db } from './auth.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

let selectedRating = 0;
let testimonialsData = [];
let currentPage = 1;
const pageSize = 6;
let showAllMode = false;

const testimonialCollection = collection(db, 'testimonios');

const formatDate = (date) => {
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

const showNotification = (message, type = 'success') => {
    const messageContainer = document.getElementById('testimonialMessage');
    if (!messageContainer) return;
    messageContainer.innerHTML = `
        <div class="alert alert-${type} py-3 rounded-lg" role="alert">
            ${message}
        </div>
    `;
};

const highlightStars = (rating) => {
    const stars = document.querySelectorAll('#starRating .star-icon');
    stars.forEach((star) => {
        const starValue = Number(star.dataset.rating);
        if (starValue <= rating) {
            star.classList.remove('text-muted');
            star.classList.add('text-warning');
        } else {
            star.classList.remove('text-warning');
            star.classList.add('text-muted');
        }
    });
};

const updateRatingLabel = (rating) => {
    const label = document.getElementById('ratingValueLabel');
    if (!label) return;
    label.textContent = rating > 0 ? `${rating} / 5 estrellas` : 'Selecciona tu calificación';
};

const setRating = (rating) => {
    selectedRating = rating;
    const input = document.getElementById('testimonialRating');
    if (input) input.value = rating;
    highlightStars(rating);
    updateRatingLabel(rating);
};

const resetForm = () => {
    const form = document.getElementById('testimonialForm');
    if (form) form.reset();
    selectedRating = 0;
    const input = document.getElementById('testimonialRating');
    if (input) input.value = 0;
    highlightStars(0);
    updateRatingLabel(0);
};

const initStarRating = () => {
    const stars = document.querySelectorAll('#starRating .star-icon');
    const starRating = document.getElementById('starRating');
    
    stars.forEach((star) => {
        const rating = Number(star.dataset.rating);
        star.addEventListener('click', () => setRating(rating));
        star.addEventListener('mouseover', () => highlightStars(rating));
    });

    if (starRating) {
        starRating.addEventListener('mouseleave', () => highlightStars(selectedRating));
    }
};

const renderTestimonials = (items) => {
    const testimonialsList = document.getElementById('testimonialsList');
    const noTestimonials = document.getElementById('noTestimonials');
    
    if (!testimonialsList) return;
    testimonialsList.innerHTML = '';

    if (!items.length) {
        if (noTestimonials) noTestimonials.classList.remove('d-none');
        return;
    }

    if (noTestimonials) noTestimonials.classList.add('d-none');

    items.forEach((item) => {
        const createdAt = item.fecha_creacion && item.fecha_creacion.toDate ? item.fecha_creacion.toDate() : new Date();
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'col-lg-4 col-md-6 mb-4';
        testimonialCard.innerHTML = `
            <div class="testimonial-card p-4 h-100 d-flex flex-column bg-white rounded-lg shadow-sm">
                <div class="d-flex align-items-center mb-3">
                    <div class="testimonial-avatar-placeholder mr-3">${item.nombre ? item.nombre.charAt(0).toUpperCase() : 'C'}</div>
                    <div>
                        <h5 class="mb-1 font-weight-bold text-dark">${item.nombre || 'Cliente satisfecho'}</h5>
                        <small class="text-muted">${item.profesion || 'Cliente'}</small>
                    </div>
                </div>
                <div class="mb-3">
                    ${Array.from({ length: 5 }, (_, index) => `
                        <i class="fa fa-star ${index < (item.calificacion || 0) ? 'text-warning' : 'text-muted'}"></i>
                    `).join('')}
                </div>
                <p class="text-muted flex-grow-1 mb-3">${item.texto || ''}</p>
                <small class="text-muted">Publicado: ${formatDate(createdAt)}</small>
            </div>
        `;

        testimonialsList.appendChild(testimonialCard);
    });
};

const renderPaginationControls = () => {
    const pager = document.getElementById('testimonialPager');
    if (!pager) return;

    const totalPages = Math.max(1, Math.ceil(testimonialsData.length / pageSize));
    const pageInfo = showAllMode
        ? `Mostrando todos los ${testimonialsData.length} testimonios`
        : `Página ${currentPage} de ${totalPages}`;

    if (testimonialsData.length <= pageSize && !showAllMode) {
        pager.classList.add('d-none');
        pager.innerHTML = '';
        return;
    }

    pager.classList.remove('d-none');
    pager.innerHTML = `
        <div class="mb-3 mb-md-0"><small class="text-muted">${pageInfo}</small></div>
        <div class="btn-group" role="group" aria-label="Controles de testimonios">
            <button type="button" class="btn btn-outline-primary btn-sm" id="testimonialPrevBtn" ${showAllMode || currentPage === 1 ? 'disabled' : ''}>Anterior</button>
            <button type="button" class="btn btn-outline-primary btn-sm" id="testimonialShowAllBtn">${showAllMode ? 'Mostrar menos' : 'Ver todo'}</button>
            <button type="button" class="btn btn-primary btn-sm" id="testimonialNextBtn" ${showAllMode || currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
        </div>
    `;

    document.getElementById('testimonialPrevBtn')?.addEventListener('click', () => goToPage(currentPage - 1));
    document.getElementById('testimonialNextBtn')?.addEventListener('click', () => goToPage(currentPage + 1));
    document.getElementById('testimonialShowAllBtn')?.addEventListener('click', toggleShowAllMode);
};

const renderTestimonialsPage = () => {
    if (showAllMode) {
        renderTestimonials(testimonialsData);
    } else {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        renderTestimonials(testimonialsData.slice(start, end));
    }
    renderPaginationControls();
};

const goToPage = (page) => {
    const totalPages = Math.max(1, Math.ceil(testimonialsData.length / pageSize));
    currentPage = Math.max(1, Math.min(page, totalPages));
    showAllMode = false;
    renderTestimonialsPage();
};

const toggleShowAllMode = () => {
    showAllMode = !showAllMode;
    if (!showAllMode) {
        currentPage = 1;
    }
    renderTestimonialsPage();
};

const loadTestimonials = async () => {
    try {
        const q = query(testimonialCollection, where('estado', '==', 'activo'), orderBy('fecha_creacion', 'desc'));
        const querySnapshot = await getDocs(q);
        testimonialsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        currentPage = 1;
        showAllMode = false;
        renderTestimonialsPage();
    } catch (error) {
        console.error('Error cargando testimonios:', error);
        showNotification('No fue posible cargar los testimonios. Revisa tu conexión o permisos de Firestore.', 'danger');
    }
};

const submitTestimonial = async (event) => {
    event.preventDefault();
    showNotification('Validando tu testimonio...', 'info');

    const nameInput = document.getElementById('testimonialName');
    const professionInput = document.getElementById('testimonialProfession');
    const textInput = document.getElementById('testimonialText');
    const ratingInput = document.getElementById('testimonialRating');

    const name = nameInput?.value.trim();
    const profession = professionInput?.value.trim();
    const text = textInput?.value.trim();
    const rating = Number(ratingInput?.value || selectedRating || 0);

    if (!name || !profession || !text || rating === 0) {
        showNotification('Completa todos los campos correctamente y selecciona una calificación.', 'danger');
        return;
    }

    try {
        await addDoc(testimonialCollection, {
            nombre: name,
            profesion: profession,
            calificacion: rating,
            texto: text,
            estado: 'activo',
            fecha_creacion: serverTimestamp(),
            fecha_actualizacion: serverTimestamp()
        });

        showNotification('Tu testimonio se ha enviado correctamente. Gracias por confiar en nosotros.', 'success');
        resetForm();
        await loadTestimonials();

        // Cerrar modal si está disponible
        if (window.jQuery) {
            window.jQuery('#modalTestimonio').modal('hide');
        }
    } catch (error) {
        console.error('Error enviando testimonio:', error);
        showNotification('Error al enviar el testimonio. Intenta nuevamente en unos minutos.', 'danger');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initStarRating();
    loadTestimonials();

    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', submitTestimonial);
    }
});
