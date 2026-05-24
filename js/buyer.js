// ============================================
// FUNCIONALIDAD PÁGINA BUYER/PERFIL
// ============================================

lucide.createIcons();

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    inicializarMenuSidebar();
    inicializarFormularios();
    inicializarAvatarUpload();
    inicializarToggles();
    inicializarRangeSlider();
    inicializarFuncionalidadesSeguridad(); // Nueva función de seguridad
    cargarDatosGuardados();
});

// ============================================
// 1. NAVEGACIÓN DEL MENÚ SIDEBAR
// ============================================
function inicializarMenuSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    const formCards = document.querySelectorAll('.form-card');

    menuItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Si es cerrar sesión, manejar diferente
            if (this.textContent.trim() === 'Cerrar Sesión') {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    // Usar Firebase signOut
                    import('https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js').then(({ getAuth, signOut }) => {
                        const auth = getAuth();
                        signOut(auth).then(() => {
                            window.location.href = 'home.html';
                        }).catch((error) => {
                            console.error('Error al cerrar sesión:', error);
                        });
                    });
                }
                return;
            }

            // Remover clase active de todos los items
            menuItems.forEach(m => m.classList.remove('active'));
            formCards.forEach(form => form.style.display = 'none');

            // Agregar clase active al item clickeado
            this.classList.add('active');

            // Mostrar formulario correspondiente con animación
            if (formCards[index]) {
                formCards[index].style.display = 'block';
                formCards[index].style.animation = 'fadeIn 0.3s ease-in-out';
            }
        });
    });
}

// ============================================
// 2. GESTIÓN DE FORMULARIOS
// ============================================
function inicializarFormularios() {
    const forms = document.querySelectorAll('form');

    forms.forEach((form, index) => {
        const inputs = form.querySelectorAll('input, textarea, select');

        // Limpiar placeholders al focus
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (this.value === this.getAttribute('placeholder') || 
                    this.value === 'Nombre Completo' || 
                    this.value === 'Teléfono' || 
                    this.value === 'Correo Electrónico') {
                    this.value = '';
                }
                this.style.borderColor = 'var(--color-primary)';
            });

            input.addEventListener('blur', function() {
                this.style.borderColor = 'var(--color-border)';
                if (this.value === '') {
                    this.value = this.getAttribute('placeholder') || '';
                }
            });

            // Validación en tiempo real
            input.addEventListener('change', function() {
                validarInput(this);
            });
        });

        // Manejar envío de formulario
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (validarFormulario(form)) {
                    guardarDatos(form, index);
                }
            });
        }
    });
}

function validarInput(input) {
    let isValid = true;
    let errorMsg = '';

    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value);
        errorMsg = 'Correo inválido';
    }

    if (input.type === 'tel' && input.value) {
        const telRegex = /^[\d\s\-\+\(\)]+$/;
        isValid = telRegex.test(input.value) && input.value.replace(/\D/g, '').length >= 10;
        errorMsg = 'Teléfono inválido (mínimo 10 dígitos)';
    }

    if (input.value === '' && input.required) {
        isValid = false;
        errorMsg = 'Este campo es requerido';
    }

    if (!isValid) {
        input.style.borderColor = '#ff6b6b';
        mostrarToast(errorMsg, 'error');
    } else {
        input.style.borderColor = 'var(--color-border)';
    }

    return isValid;
}

function validarFormulario(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validarInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// ============================================
// 3. CARGA DE AVATAR
// ============================================
function inicializarAvatarUpload() {
    const avatarCard = document.querySelector('.avatar-upload');

    if (avatarCard) {
        // Crear input file oculto
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        avatarCard.appendChild(fileInput);

        // Hacer clickeable el avatar
        avatarCard.style.cursor = 'pointer';
        avatarCard.addEventListener('click', () => fileInput.click());

        // Procesar archivo seleccionado
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Guardar en localStorage
                    localStorage.setItem('avatarImage', event.target.result);
                    
                    // Actualizar vista previa
                    avatarCard.style.backgroundImage = `url(${event.target.result})`;
                    avatarCard.style.backgroundSize = 'cover';
                    avatarCard.style.backgroundPosition = 'center';
                    
                    mostrarToast('Foto de perfil actualizada', 'success');
                };
                reader.readAsDataURL(file);
            } else {
                mostrarToast('Por favor selecciona una imagen válida', 'error');
            }
        });

        // Cargar avatar guardado
        const savedAvatar = localStorage.getItem('avatarImage');
        if (savedAvatar) {
            avatarCard.style.backgroundImage = `url(${savedAvatar})`;
            avatarCard.style.backgroundSize = 'cover';
        }
    }
}

// ============================================
// 4. TOGGLES PARA NOTIFICACIONES
// ============================================
function inicializarToggles() {
    const toggles = document.querySelectorAll('.toggle');

    toggles.forEach((toggle, index) => {
        // Cargar estado guardado
        const savedState = localStorage.getItem(`toggle-${index}`);
        if (savedState === 'true') {
            toggle.classList.add('active');
            toggle.style.background = 'var(--color-primary)';
        }

        toggle.style.cursor = 'pointer';
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            const isActive = this.classList.contains('active');
            this.style.background = isActive ? 'var(--color-primary)' : '#cbd5e1';

            // Animar handle
            const handle = this.querySelector('::after') || this;
            if (isActive) {
                this.style.boxShadow = '0 0 0 3px rgba(30, 41, 59, 0.1)';
            } else {
                this.style.boxShadow = 'none';
            }

            // Guardar estado
            localStorage.setItem(`toggle-${index}`, isActive);
            mostrarToast(`Notificaciones ${isActive ? 'activadas' : 'desactivadas'}`, 'info');
        });
    });
}

// ============================================
// 5. RANGE SLIDER PERSONALIZADO
// ============================================
function inicializarRangeSlider() {
    const handles = document.querySelectorAll('.range-handle');
    const track = document.querySelector('.range-track');
    const MIN_VALUE = 100000000; // 100 millones
    const MAX_VALUE = 500000000; // 500 millones

    if (handles.length === 0 || !track) return;

    let isDragging = false;
    let currentHandle = null;

    // Función para convertir porcentaje a valor
    function porcentajeAValor(porcentaje) {
        return Math.round((porcentaje / 100) * MAX_VALUE);
    }

    // Función para convertir valor a porcentaje
    function valorAPorcentaje(valor) {
        return (valor / MAX_VALUE) * 100;
    }

    // Función para formatear valor con separadores
    function formatearValor(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor).replace('COP', '').trim();
    }

    // Función para actualizar valores mostrados
    function actualizarValoresMostrados() {
        handles.forEach(handle => {
            const porcentaje = parseFloat(handle.style.left);
            const valor = porcentajeAValor(porcentaje);
            const tipo = handle.getAttribute('data-handle');
            const elementoValor = document.getElementById(`value-${tipo}`);
            
            if (elementoValor) {
                elementoValor.textContent = formatearValor(valor);
                // Animación
                elementoValor.style.animation = 'none';
                setTimeout(() => {
                    elementoValor.style.animation = 'pulse 0.3s ease-out';
                }, 10);
            }
        });
    }

    // Iniciar interacción
    handles.forEach((handle, index) => {
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            currentHandle = handle;
            handle.style.zIndex = 100;
        });

        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            currentHandle = handle;
        });
    });

    // Movimiento del ratón
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !currentHandle || !track) return;

        const trackRect = track.getBoundingClientRect();
        let newLeft = ((e.clientX - trackRect.left) / trackRect.width) * 100;
        newLeft = Math.max(0, Math.min(100, newLeft));

        currentHandle.style.left = newLeft + '%';
        actualizarValoresMostrados();
        guardarRangeValue();
    });

    // Movimiento táctil
    document.addEventListener('touchmove', (e) => {
        if (!isDragging || !currentHandle || !track) return;

        const trackRect = track.getBoundingClientRect();
        const touch = e.touches[0];
        let newLeft = ((touch.clientX - trackRect.left) / trackRect.width) * 100;
        newLeft = Math.max(0, Math.min(100, newLeft));

        currentHandle.style.left = newLeft + '%';
        actualizarValoresMostrados();
        guardarRangeValue();
    });

    // Fin de interacción
    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (currentHandle) {
            currentHandle.style.zIndex = 'auto';
        }
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Cargar valores guardados
    cargarRangeValues();
    actualizarValoresMostrados();
}

function guardarRangeValue() {
    const handles = document.querySelectorAll('.range-handle');
    const values = Array.from(handles).map(h => h.style.left);
    localStorage.setItem('rangeValues', JSON.stringify(values));
}

function cargarRangeValues() {
    const savedValues = localStorage.getItem('rangeValues');
    if (savedValues) {
        const values = JSON.parse(savedValues);
        const handles = document.querySelectorAll('.range-handle');
        handles.forEach((handle, index) => {
            if (values[index]) {
                handle.style.left = values[index];
            }
        });
    }
}

// ============================================
// 6. GUARDAR Y CARGAR DATOS
// ============================================
function guardarDatos(form, formIndex) {
    const formData = new FormData(form);
    const data = {};

    form.querySelectorAll('input, textarea, select').forEach(field => {
        data[field.name || field.id] = field.value;
    });

    localStorage.setItem(`formData-${formIndex}`, JSON.stringify(data));
    mostrarToast('Datos guardados correctamente', 'success');
}

function cargarDatosGuardados() {
    document.querySelectorAll('form').forEach((form, index) => {
        const savedData = localStorage.getItem(`formData-${index}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            form.querySelectorAll('input, textarea, select').forEach(field => {
                const fieldName = field.name || field.id;
                if (data[fieldName]) {
                    field.value = data[fieldName];
                }
            });
        }
    });
}

// ============================================
// 7. NOTIFICACIONES TOAST
// ============================================
function mostrarToast(mensaje, tipo = 'info') {
    // Crear contenedor toast si no existe
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }

    // Crear elemento toast
    const toast = document.createElement('div');
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    toast.style.cssText = `
        background-color: ${colors[tipo]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
        min-width: 250px;
        font-weight: 500;
    `;

    toast.textContent = mensaje;
    toastContainer.appendChild(toast);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// 8. ANIMACIONES CSS
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .toggle.active::after {
        left: 22px !important;
    }

    .toggle {
        transition: background 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
        box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.1);
    }
`;
document.head.appendChild(style);

// ============================================
// 9. FUNCIONALIDADES DE SEGURIDAD
// ============================================

// ============================================
// CAMBIO DE CONTRASEÑA
// ============================================
function inicializarCambioPassword() {
    const passwordForm = document.getElementById('password-form');
    if (!passwordForm) return;

    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const currentPassword = this.currentPassword.value;
        const newPassword = this.newPassword.value;
        const confirmPassword = this.confirmPassword.value;

        // Validaciones
        if (newPassword !== confirmPassword) {
            mostrarToast('Las contraseñas no coinciden', 'error');
            return;
        }

        if (newPassword.length < 8) {
            mostrarToast('La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }

        try {
            // Importar dinámicamente las funciones de auth.js
            const { cambiarPassword } = await import('./auth.js');

            // Cambiar contraseña usando la función de auth.js
            await cambiarPassword(currentPassword, newPassword);

            mostrarToast('Contraseña cambiada exitosamente', 'success');
            this.reset();
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            if (error.code === 'auth/wrong-password') {
                mostrarToast('Contraseña actual incorrecta', 'error');
            } else if (error.code === 'auth/weak-password') {
                mostrarToast('La nueva contraseña es muy débil', 'error');
            } else {
                mostrarToast('Error al cambiar la contraseña', 'error');
            }
        }
    });
}

// ============================================
// AUTENTICACIÓN EN DOS PASOS (2FA)
// ============================================
function inicializar2FA() {
    const toggle2FA = document.getElementById('toggle-2fa');
    const setup2FA = document.getElementById('2fa-setup');
    const verify2FA = document.getElementById('verify-2fa');
    const status2FA = document.getElementById('2fa-status');

    if (!toggle2FA) return;

    // Cargar estado guardado
    const is2FAEnabled = localStorage.getItem('2fa-enabled') === 'true';
    actualizarEstado2FA(is2FAEnabled);

    toggle2FA.addEventListener('click', function() {
        if (status2FA.textContent === 'Activado') {
            // Desactivar 2FA
            if (confirm('¿Estás seguro de que deseas desactivar la autenticación de dos factores?')) {
                localStorage.setItem('2fa-enabled', 'false');
                actualizarEstado2FA(false);
                mostrarToast('2FA desactivado', 'info');
            }
        } else {
            // Mostrar setup de 2FA
            setup2FA.classList.remove('d-none');
            generarQRCode();
        }
    });

    if (verify2FA) {
        verify2FA.addEventListener('click', function() {
            const code = document.getElementById('2fa-code').value;
            if (code.length === 6 && /^\d+$/.test(code)) {
                // Simular verificación
                localStorage.setItem('2fa-enabled', 'true');
                actualizarEstado2FA(true);
                setup2FA.classList.add('d-none');
                mostrarToast('2FA activado exitosamente', 'success');
            } else {
                mostrarToast('Código inválido', 'error');
            }
        });
    }
}

function actualizarEstado2FA(enabled) {
    const status2FA = document.getElementById('2fa-status');
    const toggle2FA = document.getElementById('toggle-2fa');

    if (enabled) {
        status2FA.textContent = 'Activado';
        status2FA.className = 'text-success';
        toggle2FA.textContent = 'Desactivar 2FA';
        toggle2FA.className = 'btn btn-outline-danger';
    } else {
        status2FA.textContent = 'Desactivado';
        status2FA.className = 'text-danger';
        toggle2FA.textContent = 'Activar 2FA';
        toggle2FA.className = 'btn btn-outline-primary';
    }
}

function generarQRCode() {
    const qrCode = document.getElementById('qr-code');
    if (qrCode) {
        qrCode.innerHTML = `
            <div style="padding: 20px; background: white; border-radius: 8px;">
                <div style="width: 120px; height: 120px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 2px solid #ddd;">
                    <span style="color: #666; font-size: 12px;">QR Code</span>
                </div>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">Escanea con tu app de autenticación</p>
            </div>
        `;
    }
}

// ============================================
// BIOMETRÍA Y PASSKEYS
// ============================================
function inicializarBiometria() {
    const setupBiometric = document.getElementById('setup-biometric');
    const setupPasskey = document.getElementById('setup-passkey');
    const biometricStatus = document.getElementById('biometric-status');
    const passkeyStatus = document.getElementById('passkey-status');

    // Cargar estados guardados
    const biometricEnabled = localStorage.getItem('biometric-enabled') === 'true';
    const passkeyEnabled = localStorage.getItem('passkey-enabled') === 'true';

    actualizarEstadoBiometrico(biometricEnabled);
    actualizarEstadoPasskey(passkeyEnabled);

    if (setupBiometric) {
        setupBiometric.addEventListener('click', async function() {
            if (!biometricEnabled) {
                try {
                    // Verificar soporte de WebAuthn
                    if (!window.PublicKeyCredential) {
                        mostrarToast('Tu navegador no soporta biometría', 'error');
                        return;
                    }

                    // Simular configuración de biometría
                    localStorage.setItem('biometric-enabled', 'true');
                    actualizarEstadoBiometrico(true);
                    mostrarToast('Biometría configurada exitosamente', 'success');
                } catch (error) {
                    mostrarToast('Error al configurar biometría', 'error');
                }
            } else {
                if (confirm('¿Deseas desactivar la biometría?')) {
                    localStorage.setItem('biometric-enabled', 'false');
                    actualizarEstadoBiometrico(false);
                    mostrarToast('Biometría desactivada', 'info');
                }
            }
        });
    }

    if (setupPasskey) {
        setupPasskey.addEventListener('click', async function() {
            if (!passkeyEnabled) {
                try {
                    // Simular creación de passkey
                    localStorage.setItem('passkey-enabled', 'true');
                    actualizarEstadoPasskey(true);
                    mostrarToast('Passkey creado exitosamente', 'success');
                } catch (error) {
                    mostrarToast('Error al crear passkey', 'error');
                }
            } else {
                if (confirm('¿Deseas eliminar el passkey?')) {
                    localStorage.setItem('passkey-enabled', 'false');
                    actualizarEstadoPasskey(false);
                    mostrarToast('Passkey eliminado', 'info');
                }
            }
        });
    }
}

function actualizarEstadoBiometrico(enabled) {
    const status = document.getElementById('biometric-status');
    const button = document.getElementById('setup-biometric');

    if (enabled) {
        status.textContent = 'Configurado';
        status.className = 'text-success';
        button.textContent = 'Desactivar';
        button.className = 'btn btn-outline-danger';
    } else {
        status.textContent = 'No configurado';
        status.className = 'text-danger';
        button.textContent = 'Configurar';
        button.className = 'btn btn-outline-primary';
    }
}

function actualizarEstadoPasskey(enabled) {
    const status = document.getElementById('passkey-status');
    const button = document.getElementById('setup-passkey');

    if (enabled) {
        status.textContent = 'Configurado';
        status.className = 'text-success';
        button.textContent = 'Eliminar Passkey';
        button.className = 'btn btn-outline-danger';
    } else {
        status.textContent = 'No configurado';
        status.className = 'text-danger';
        button.textContent = 'Crear Passkey';
        button.className = 'btn btn-outline-primary';
    }
}

// ============================================
// CUENTAS VINCULADAS (SOCIAL LOGIN)
// ============================================
function inicializarCuentasVinculadas() {
    const socialButtons = ['facebook', 'twitter', 'google'];

    socialButtons.forEach(provider => {
        const button = document.getElementById(`link-${provider}`);
        if (button) {
            // Cargar estado guardado
            const isLinked = localStorage.getItem(`social-${provider}`) === 'true';
            actualizarEstadoSocial(provider, isLinked);

            button.addEventListener('click', function() {
                if (isLinked) {
                    // Desvincular
                    if (confirm(`¿Deseas desvincular tu cuenta de ${provider}?`)) {
                        localStorage.setItem(`social-${provider}`, 'false');
                        actualizarEstadoSocial(provider, false);
                        mostrarToast(`Cuenta de ${provider} desvinculada`, 'info');
                    }
                } else {
                    // Vincular (simulado)
                    localStorage.setItem(`social-${provider}`, 'true');
                    actualizarEstadoSocial(provider, true);
                    mostrarToast(`Cuenta de ${provider} vinculada exitosamente`, 'success');
                }
            });
        }
    });
}

function actualizarEstadoSocial(provider, linked) {
    const button = document.getElementById(`link-${provider}`);
    if (!button) return;

    if (linked) {
        button.textContent = 'Desvincular';
        button.className = 'btn btn-sm btn-outline-danger';
    } else {
        button.textContent = 'Vincular';
        button.className = 'btn btn-sm btn-outline-primary';
    }
}

// ============================================
// SESIONES ACTIVAS
// ============================================
function inicializarSesionesActivas() {
    cargarSesionesActivas();

    const revokeAllBtn = document.getElementById('revoke-all-sessions');
    if (revokeAllBtn) {
        revokeAllBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión en todos los dispositivos?')) {
                // Simular cierre de todas las sesiones
                localStorage.removeItem('active-sessions');
                cargarSesionesActivas();
                mostrarToast('Sesión cerrada en todos los dispositivos', 'success');
            }
        });
    }
}

function cargarSesionesActivas() {
    const sessionsContainer = document.getElementById('active-sessions');
    if (!sessionsContainer) return;

    // Simular sesiones activas (en producción vendrían del backend)
    const sesiones = JSON.parse(localStorage.getItem('active-sessions')) || [
        {
            id: 'current',
            device: 'Chrome en Windows',
            location: 'Medellín, Colombia',
            lastActivity: new Date().toLocaleString(),
            current: true
        },
        {
            id: 'session-1',
            device: 'Safari en iPhone',
            location: 'Medellín, Colombia',
            lastActivity: new Date(Date.now() - 3600000).toLocaleString(),
            current: false
        }
    ];

    sessionsContainer.innerHTML = sesiones.map(session => `
        <div class="session-item ${session.current ? 'session-current' : ''}">
            <div class="session-info">
                <div class="session-device">${session.device}</div>
                <div class="session-location">${session.location} • Última actividad: ${session.lastActivity}</div>
            </div>
            ${!session.current ? `
                <button class="btn btn-sm btn-outline-danger revoke-session" data-session-id="${session.id}">
                    Cerrar Sesión
                </button>
            ` : '<span class="badge badge-primary">Sesión Actual</span>'}
        </div>
    `).join('');

    // Agregar event listeners para cerrar sesiones individuales
    document.querySelectorAll('.revoke-session').forEach(btn => {
        btn.addEventListener('click', function() {
            const sessionId = this.getAttribute('data-session-id');
            revocarSesion(sessionId);
        });
    });

    // Guardar sesiones
    localStorage.setItem('active-sessions', JSON.stringify(sesiones));
}

function revocarSesion(sessionId) {
    const sesiones = JSON.parse(localStorage.getItem('active-sessions')) || [];
    const sesionesFiltradas = sesiones.filter(s => s.id !== sessionId);

    localStorage.setItem('active-sessions', JSON.stringify(sesionesFiltradas));
    cargarSesionesActivas();
    mostrarToast('Sesión cerrada exitosamente', 'success');
}

// ============================================
// DESCARGA DE DATOS
// ============================================
function inicializarDescargaDatos() {
    const downloadBtn = document.getElementById('download-data');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function() {
        // Recopilar todos los datos del usuario
        const userData = {
            perfil: JSON.parse(localStorage.getItem('formData-0') || '{}'),
            preferencias: JSON.parse(localStorage.getItem('formData-1') || '{}'),
            configuracionSeguridad: {
                biometrico: localStorage.getItem('biometric-enabled') === 'true',
                passkey: localStorage.getItem('passkey-enabled') === 'true',
                twoFactor: localStorage.getItem('2fa-enabled') === 'true',
                cuentasVinculadas: {
                    facebook: localStorage.getItem('social-facebook') === 'true',
                    twitter: localStorage.getItem('social-twitter') === 'true',
                    google: localStorage.getItem('social-google') === 'true'
                }
            },
            sesionesActivas: JSON.parse(localStorage.getItem('active-sessions') || '[]'),
            fechaDescarga: new Date().toISOString(),
            versionApp: '1.0.0'
        };

        // Crear archivo JSON
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = `mis-datos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar URL
        URL.revokeObjectURL(url);

        mostrarToast('Descarga completada', 'success');
    });
}

// ============================================
// ELIMINAR CUENTA
// ============================================
function inicializarEliminarCuenta() {
    const deleteBtn = document.getElementById('delete-account');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', async function() {
        const confirmText = prompt('Para confirmar la eliminación de tu cuenta, escribe "ELIMINAR CUENTA":');

        if (confirmText === 'ELIMINAR CUENTA') {
            if (confirm('¿Estás ABSOLUTAMENTE seguro? Esta acción no se puede deshacer.')) {
                try {
                    // Importar dinámicamente las funciones de auth.js
                    const { eliminarCuentaUsuario } = await import('./auth.js');

                    // Eliminar cuenta usando la función de auth.js
                    await eliminarCuentaUsuario();

                    // Limpiar datos locales
                    localStorage.clear();

                    mostrarToast('Cuenta eliminada exitosamente', 'success');

                    // Redirigir después de un delay
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 2000);
                } catch (error) {
                    console.error('Error al eliminar cuenta:', error);
                    mostrarToast('Error al eliminar la cuenta. Inténtalo de nuevo.', 'error');
                }
            }
        } else {
            mostrarToast('Confirmación incorrecta', 'error');
        }
    });
}

// ============================================
// INICIALIZACIÓN DE TODAS LAS FUNCIONALIDADES DE SEGURIDAD
// ============================================
function inicializarFuncionalidadesSeguridad() {
    inicializarCambioPassword();
    inicializar2FA();
    inicializarBiometria();
    inicializarCuentasVinculadas();
    inicializarSesionesActivas();
    inicializarDescargaDatos();
    inicializarEliminarCuenta();
}

console.log('✅ Interactividad de buyer cargada correctamente');
