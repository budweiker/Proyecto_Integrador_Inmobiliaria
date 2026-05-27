 // 1. Intentamos capturar la sesión de cualquier clave común
        const datosSesion = localStorage.getItem('usuarioLogueado') || 
                            localStorage.getItem('usuario') || 
                            localStorage.getItem('user') || 
                            localStorage.getItem('sesion');
        
        let usuarioActual = null;
        if (datosSesion) {
            try {
                usuarioActual = JSON.parse(datosSesion);
            } catch (e) {
                console.error("Error al parsear la sesión", e);
            }
        }
        
        // 2. Buscamos el rol de forma ultra-flexible
        let esAdmin = false;
        
        if (usuarioActual) {
            // Buscamos cualquier propiedad que se llame rol, role, o tipo
            const rolTexto = (usuarioActual.rol || usuarioActual.role || usuarioActual.tipo || "").toString().trim().toLowerCase();
            const correoTexto = (usuarioActual.correo || usuarioActual.email || "").toString().trim().toLowerCase();
            
            // Si el rol dice "admin" (ej: Admin, administrador, admin) o el correo es de admin, lo dejamos pasar
            if (rolTexto.includes('admin') || correoTexto.includes('admin')) {
                esAdmin = true;
            }
        }

        // 3. Si no pasó ninguna validación, ejecutamos el bloqueo
        if (!esAdmin) {
            alert("Acceso denegado. Este módulo es exclusivo para el Administrador.");
            window.location.href = "admin.html"; // Te regresa al panel de administración para que no te estanques
        }