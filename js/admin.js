import { obtenerUsuarios, eliminarUsuario, toggleEstadoUsuario, verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';

let todosLosUsuarios = [];

// Helper to escape HTML characters just in case, though textContent is used
const escapeHTML = (str) => {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Safe Helpers for Loading, Empty, and Error states using DOM APIs
const mostrarLoading = () => {
    const tableBody = document.getElementById('users-table-body');
    tableBody.replaceChildren();
    
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 8;
    td.className = 'loading';
    td.style.textAlign = 'center';
    td.style.padding = '4rem';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-spinner fa-spin me-2';
    td.appendChild(icon);
    
    const text = document.createTextNode(' Cargando usuarios...');
    td.appendChild(text);
    
    row.appendChild(td);
    tableBody.appendChild(row);
};

const mostrarSinResultados = () => {
    const tableBody = document.getElementById('users-table-body');
    tableBody.replaceChildren();
    
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 8;
    td.style.textAlign = 'center';
    td.style.padding = '4rem';
    td.style.color = '#94a3b8';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-inbox fa-3x mb-3 d-block';
    td.appendChild(icon);
    
    const title = document.createElement('div');
    title.className = 'fw-bold text-secondary fs-5 mb-1';
    title.textContent = 'No se encontraron usuarios';
    td.appendChild(title);
    
    const subtitle = document.createElement('div');
    subtitle.className = 'small text-muted';
    subtitle.textContent = 'Intenta con otro rango de fechas';
    td.appendChild(subtitle);
    
    row.appendChild(td);
    tableBody.appendChild(row);
};

const mostrarError = (mensaje) => {
    const tableBody = document.getElementById('users-table-body');
    tableBody.replaceChildren();
    
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 8;
    td.style.textAlign = 'center';
    td.style.padding = '4rem';
    td.style.color = '#ef4444';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-triangle fa-2x mb-2 d-block';
    td.appendChild(icon);
    
    const text = document.createElement('div');
    text.className = 'fw-semibold';
    text.textContent = mensaje || 'Error al cargar usuarios. Verifica los permisos de Firebase.';
    td.appendChild(text);
    
    row.appendChild(td);
    tableBody.appendChild(row);
};

const renderizarTabla = (usuarios) => {
    const tableBody = document.getElementById('users-table-body');
    if (usuarios.length === 0) {
        mostrarSinResultados();
        return;
    }
    
    tableBody.replaceChildren();
    
    usuarios.forEach(user => {
        const row = document.createElement('tr');
        const esActivo = user.activo !== false; // true by default if not set

        let roleClass = 'default';
        let roleText = user.rol || 'No especificado';
        const roleLower = roleText.toLowerCase();
        if (roleLower === 'comprador') {
            roleClass = 'comprador';
        } else if (roleLower === 'vendedor') {
            roleClass = 'vendedor';
        } else if (roleLower === 'admin' || roleLower === 'administrador') {
            roleClass = 'admin';
            roleText = 'Admin';
        }

        // Cell 1: Cédula
        const tdCedula = document.createElement('td');
        const strongCedula = document.createElement('strong');
        strongCedula.textContent = user.cedula || 'N/A';
        tdCedula.appendChild(strongCedula);
        row.appendChild(tdCedula);

        // Cell 2: Nombre
        const tdNombre = document.createElement('td');
        const spanNombre = document.createElement('span');
        spanNombre.style.fontWeight = '600';
        spanNombre.style.color = '#0f172a';
        spanNombre.textContent = user.nombre || 'N/A';
        tdNombre.appendChild(spanNombre);
        row.appendChild(tdNombre);

        // Cell 3: Correo
        const tdCorreo = document.createElement('td');
        const spanCorreo = document.createElement('span');
        spanCorreo.style.color = '#64748b';
        spanCorreo.style.fontSize = '0.9rem';
        spanCorreo.textContent = user.email || 'N/A';
        tdCorreo.appendChild(spanCorreo);
        row.appendChild(tdCorreo);

        // Cell 4: Fecha Nacimiento
        const tdFechaNac = document.createElement('td');
        tdFechaNac.textContent = user.fechaNacimiento || 'N/A';
        row.appendChild(tdFechaNac);

        // Cell 5: Fecha Registro
        const tdFechaReg = document.createElement('td');
        const spanFechaReg = document.createElement('span');
        spanFechaReg.style.color = '#475569';
        spanFechaReg.textContent = user.fechaRegistro || '2026-05-21';
        tdFechaReg.appendChild(spanFechaReg);
        row.appendChild(tdFechaReg);

        // Cell 6: Rol
        const tdRol = document.createElement('td');
        const spanRol = document.createElement('span');
        spanRol.className = `badge ${roleClass}`;
        spanRol.textContent = roleText;
        tdRol.appendChild(spanRol);
        row.appendChild(tdRol);

        // Cell 7: Estado (Activo/Inactivo)
        const tdEstado = document.createElement('td');
        tdEstado.style.textAlign = 'center';
        const spanEstado = document.createElement('span');
        spanEstado.className = `badge-estado ${esActivo ? 'activo' : 'inactivo'}`;
        
        const iconCircle = document.createElement('i');
        iconCircle.className = 'fas fa-circle';
        iconCircle.style.fontSize = '6px';
        iconCircle.style.verticalAlign = 'middle';
        
        spanEstado.appendChild(iconCircle);
        spanEstado.appendChild(document.createTextNode(esActivo ? ' Activo' : ' Inactivo'));
        tdEstado.appendChild(spanEstado);
        row.appendChild(tdEstado);

        // Cell 8: Acciones (Toggle Active, Delete)
        const tdAcciones = document.createElement('td');
        tdAcciones.style.textAlign = 'center';
        
        const divAcciones = document.createElement('div');
        divAcciones.style.display = 'flex';
        divAcciones.style.justifyContent = 'center';
        divAcciones.style.alignItems = 'center';
        divAcciones.style.gap = '6px';

        // Toggle button
        const btnToggle = document.createElement('button');
        btnToggle.className = `btn-toggle ${esActivo ? 'btn-desactivar' : 'btn-activar'}`;
        btnToggle.setAttribute('data-id', user.id);
        btnToggle.setAttribute('data-estado', esActivo);
        btnToggle.title = esActivo ? 'Desactivar cuenta' : 'Activar cuenta';
        
        const iconToggle = document.createElement('i');
        iconToggle.className = `fas ${esActivo ? 'fa-user-slash' : 'fa-user-check'}`;
        btnToggle.appendChild(iconToggle);
        divAcciones.appendChild(btnToggle);

        // Delete button
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.setAttribute('data-id', user.id);
        btnDelete.title = 'Eliminar usuario';
        
        const iconDelete = document.createElement('i');
        iconDelete.className = 'fas fa-trash-alt';
        btnDelete.appendChild(iconDelete);
        divAcciones.appendChild(btnDelete);

        tdAcciones.appendChild(divAcciones);
        row.appendChild(tdAcciones);

        tableBody.appendChild(row);
    });
};

const cargarUsuarios = async () => {
    mostrarLoading();
    try {
        todosLosUsuarios = await obtenerUsuarios();
        actualizarContadorUsuarios(todosLosUsuarios.length);
        renderizarTabla(todosLosUsuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        mostrarError('Error al cargar usuarios. Verifica los permisos de Firebase.');
    }
};

const actualizarContadorUsuarios = (total) => {
    const contador = document.getElementById('total-usuarios');
    if (contador) {
        contador.textContent = total.toString();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Verify auth session and Admin role access
    verificarEstadoSesion(async (user) => {
        if (!user) {
            window.location.href = 'profiles.html';
            return;
        }
        try {
            const usuario = await obtenerUsuarioActual();
            const rol = (usuario && (usuario.rol || '')).toString().toLowerCase();
            if (rol !== 'admin' && rol !== 'administrador') {
                alert('Acceso restringido: se requieren permisos de administrador.');
                window.location.href = 'home.html';
                return;
            }
            // User authorized
            cargarUsuarios();
        } catch (err) {
            console.error('Error comprobando rol de usuario:', err);
            window.location.href = 'profiles.html';
        }
    });

    // Date Filters Listeners
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const fechaDesdeInput = document.getElementById('fecha-desde');
    const fechaHastaInput = document.getElementById('fecha-hasta');

    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            const desde = fechaDesdeInput.value; // Formato YYYY-MM-DD
            const hasta = fechaHastaInput.value; // Formato YYYY-MM-DD

            if (!desde && !hasta) {
                alert("Por favor selecciona al menos un rango de fecha.");
                return;
            }

            const filtradosPorFecha = todosLosUsuarios.filter(user => {
                const fechaRegUser = user.fechaRegistro || '2026-05-21'; 

                if (desde && fechaRegUser < desde) return false;
                if (hasta && fechaRegUser > hasta) return false;
                return true;
            });

            renderizarTabla(filtradosPorFecha);
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (fechaDesdeInput) fechaDesdeInput.value = '';
            if (fechaHastaInput) fechaHastaInput.value = '';
            renderizarTabla(todosLosUsuarios);
        });
    }

    // Event Delegation for action buttons
    const tableBody = document.getElementById('users-table-body');
    if (tableBody) {
        tableBody.addEventListener('click', async (e) => {
            // Toggle active/inactive
            const btnToggle = e.target.closest('.btn-toggle');
            if (btnToggle) {
                const userId = btnToggle.getAttribute('data-id');
                const estadoActual = btnToggle.getAttribute('data-estado') === 'true';
                const nuevoEstado = !estadoActual;
                const accion = nuevoEstado ? 'activar' : 'desactivar';

                if (confirm(`¿Estás seguro de que deseas ${accion} esta cuenta de usuario?`)) {
                    try {
                        btnToggle.disabled = true;
                        
                        // Show loading state securely using DOM replacement
                        const spinner = document.createElement('i');
                        spinner.className = 'fas fa-spinner fa-spin';
                        btnToggle.replaceChildren(spinner);
                        
                        await toggleEstadoUsuario(userId, nuevoEstado);
                        
                        // Update locally
                        const idx = todosLosUsuarios.findIndex(u => u.id === userId);
                        if (idx !== -1) {
                            todosLosUsuarios[idx].activo = nuevoEstado;
                        }
                        
                        // Re-render
                        renderizarTabla(todosLosUsuarios);
                    } catch (error) {
                        console.error("Error al cambiar estado:", error);
                        alert("No se pudo cambiar el estado. Revisa los permisos de Firebase.");
                        
                        // Restore state
                        renderizarTabla(todosLosUsuarios);
                    }
                }
                return;
            }

            // Delete User
            const btnDelete = e.target.closest('.btn-delete');
            if (btnDelete) {
                const userId = btnDelete.getAttribute('data-id');
                if (confirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario de la base de datos?')) {
                    try {
                        btnDelete.disabled = true;
                        
                        const spinner = document.createElement('i');
                        spinner.className = 'fas fa-spinner fa-spin';
                        btnDelete.replaceChildren(spinner);
                        
                        await eliminarUsuario(userId);
                        
                        // Update locally
                        todosLosUsuarios = todosLosUsuarios.filter(u => u.id !== userId);
                        actualizarContadorUsuarios(todosLosUsuarios.length);
                        
                        // Re-render
                        renderizarTabla(todosLosUsuarios);
                    } catch (error) {
                        console.error("Error al eliminar usuario:", error);
                        alert("No se pudo eliminar el usuario. Revisa los permisos de Firebase.");
                        
                        // Restore state
                        renderizarTabla(todosLosUsuarios);
                    }
                }
            }
        });
    }
});