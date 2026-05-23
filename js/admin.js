import { obtenerUsuarios, eliminarUsuario, toggleEstadoUsuario, buscarUsuarios, verificarEstadoSesion, obtenerUsuarioActual } from './auth.js';

let todosLosUsuarios = [];

const renderizarTabla = (usuarios) => {
    const tableBody = document.getElementById('users-table-body');
    if (usuarios.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="loading"><i class="fas fa-search"></i> No se encontraron usuarios</td></tr>';
        return;
    }
    tableBody.innerHTML = '';
    usuarios.forEach(user => {
        const row = document.createElement('tr');
        const esActivo = user.activo !== false; // true por defecto si no tiene el campo

        let roleClass = 'default';
        let roleText = user.rol || 'No especificado';
        if (roleText.toLowerCase() === 'comprador') roleClass = 'comprador';
        else if (roleText.toLowerCase() === 'vendedor') roleClass = 'vendedor';

        // SE AGREGÓ LA QUINTA CELDA <td> CON LA FECHA DE REGISTRO
        row.innerHTML = `
            <td><strong>${user.cedula || 'N/A'}</strong></td>
            <td><span style="font-weight:600; color:#0f172a;">${user.nombre || 'N/A'}</span></td>
            <td><span style="color:#64748b; font-size:0.9rem;">${user.email || 'N/A'}</span></td>
            <td>${user.fechaNacimiento || 'N/A'}</td>
            <td><span style="color:#475569;">${user.fechaRegistro || '2026-05-21'}</span></td>
            <td><span class="badge ${roleClass}">${roleText}</span></td>
            <td style="text-align:center;">
                <span class="badge-estado ${esActivo ? 'activo' : 'inactivo'}">
                    <i class="fas ${esActivo ? 'fa-check-circle' : 'fa-ban'}"></i>
                    ${esActivo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td style="text-align: center;">
                <button class="btn-toggle ${esActivo ? 'btn-desactivar' : 'btn-activar'}" 
                    data-id="${user.id}" 
                    data-estado="${esActivo}" 
                    title="${esActivo ? 'Desactivar cuenta' : 'Activar cuenta'}">
                    <i class="fas ${esActivo ? 'fa-user-slash' : 'fa-user-check'}"></i>
                </button>
                <button class="btn-delete" data-id="${user.id}" title="Eliminar usuario">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

const cargarUsuarios = async () => {
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '<tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando usuarios...</td></tr>';
    try {
        todosLosUsuarios = await obtenerUsuarios();
        actualizarContadorUsuarios(todosLosUsuarios.length);
        renderizarTabla(todosLosUsuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        tableBody.innerHTML = '<tr><td colspan="7" class="loading" style="color:#e53e3e;"><i class="fas fa-exclamation-triangle"></i> Error al cargar usuarios. Verifica los permisos de Firebase.</td></tr>';
    }
};

const actualizarContadorUsuarios = (total) => {
    const contador = document.getElementById('total-usuarios');
    if (contador) contador.textContent = total;
};

document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario esté autenticado y tenga rol de administrador
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
            // Usuario autorizado
            cargarUsuarios();
        } catch (err) {
            console.error('Error comprobando rol de usuario:', err);
            window.location.href = 'profiles.html';
        }
    });

    // Búsqueda en tiempo real
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase().trim();
            if (termino === '') {
                renderizarTabla(todosLosUsuarios);
            } else {
                const filtrados = todosLosUsuarios.filter(user => {
                    const nombre = (user.nombre || '').toLowerCase();
                    const email = (user.email || '').toLowerCase();
                    const cedula = (user.cedula || '').toLowerCase();
                    return nombre.includes(termino) || email.includes(termino) || cedula.includes(termino);
                });
                renderizarTabla(filtrados);
            }
        });
    }

    // Botón limpiar búsqueda
    const clearBtn = document.getElementById('btn-clear-search');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            renderizarTabla(todosLosUsuarios);
            searchInput.focus();
        });
    }

    // --- NUEVO: ESCUCHAS PARA EL MÓDULO DE FILTRO DE FECHAS ---
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
                // Si el usuario no tiene fecha de registro, le asignamos la de hoy por defecto para no romper el filtro
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
            renderizarTabla(todosLosUsuarios); // Restablece la tabla completa
        });
    }
    // ---------------------------------------------------------

    // Delegación de eventos en la tabla
    document.getElementById('users-table-body').addEventListener('click', async (e) => {

        // Toggle activar/desactivar
        const btnToggle = e.target.closest('.btn-toggle');
        if (btnToggle) {
            const userId = btnToggle.getAttribute('data-id');
            const estadoActual = btnToggle.getAttribute('data-estado') === 'true';
            const nuevoEstado = !estadoActual;
            const accion = nuevoEstado ? 'activar' : 'desactivar';

            if (confirm(`¿Estás seguro de que deseas ${accion} esta cuenta de usuario?`)) {
                try {
                    btnToggle.disabled = true;
                    btnToggle.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    await toggleEstadoUsuario(userId, nuevoEstado);
                    // Actualizar localmente sin recargar todo
                    const idx = todosLosUsuarios.findIndex(u => u.id === userId);
                    if (idx !== -1) todosLosUsuarios[idx].activo = nuevoEstado;
                    // Re-renderizar con el filtro actual si hay búsqueda activa
                    const termino = searchInput ? searchInput.value.toLowerCase().trim() : '';
                    if (termino) {
                        const filtrados = todosLosUsuarios.filter(user => {
                            return (user.nombre||'').toLowerCase().includes(termino)
                                || (user.email||'').toLowerCase().includes(termino)
                                || (user.cedula||'').toLowerCase().includes(termino);
                        });
                        renderizarTabla(filtrados);
                    } else {
                        renderizarTabla(todosLosUsuarios);
                    }
                } catch (error) {
                    console.error("Error al cambiar estado:", error);
                    alert("No se pudo cambiar el estado. Revisa los permisos de Firebase.");
                    btnToggle.disabled = false;
                }
            }
            return;
        }

        // Eliminar usuario
        const btnDelete = e.target.closest('.btn-delete');
        if (btnDelete) {
            const userId = btnDelete.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario de la base de datos?')) {
                try {
                    await eliminarUsuario(userId);
                    todosLosUsuarios = todosLosUsuarios.filter(u => u.id !== userId);
                    actualizarContadorUsuarios(todosLosUsuarios.length);
                    renderizarTabla(todosLosUsuarios);
                } catch (error) {
                    console.error("Error al eliminar usuario:", error);
                    alert("No se pudo eliminar el usuario. Revisa los permisos de Firebase.");
                }
            }
        }
    });
});