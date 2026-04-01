$(document).ready(function() {
    "use strict";

    // 1. Scroll Suave para los links de navegación
    $('.smooth-scroll').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            var headerOffset = 70; // altura aprox del fixed header

            $('html, body').animate({
                scrollTop: $(hash).offset().top - headerOffset
            }, 800, function() {
                // Actualiza URL opcionalmente (sin salto):
                // window.history.pushState(null, null, hash);
            });
            
            // Cerrar menú responsivo en móviles al hacer clic en un link
            $('.navbar-collapse').collapse('hide');
        }
    });

    // 2. Control visual del Navbar (Cambio de diseño al hacer scroll)
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-sm').removeClass('py-3').addClass('py-2');
        } else {
            $('.navbar').removeClass('shadow-sm').removeClass('py-2').addClass('py-3');
        }
    });

    // 3. Manejo funcional básico del Formulario "Buscador"
    $('#searchForm').on('submit', function(e) {
        e.preventDefault(); // Previene envío global
        
        // Obtener datos
        var ubicacion = $('#ubicacion').val();
        var tipo = $('#tipo').val();
        var hab = $('#habitaciones').val();
        var precio = $('#precio').val();
        var btn = $(this).find('button[type="submit"]');

        // Reset anterior
        var $feedback = $('#search-feedback');
        $feedback.removeClass('d-none alert-success alert-danger').empty();

        // Validar mínimos requeridos
        if(ubicacion === "" || tipo === "") {
            $feedback.addClass('alert alert-danger').text('Por favor, selecciona al menos Ubicación y Tipo de Inmueble.').removeClass('d-none');
            return;
        }

        // Simular llamada a API / Backend (Efecto loading)
        btn.prop('disabled', true).html('Buscando <i class="fa fa-spinner fa-spin ml-2"></i>');

        setTimeout(function() {
            // Mostrar los datos capturados en consola como pidió el user
            var searchData = {
                "ubicacion": ubicacion,
                "tipoInmueble": tipo,
                "habitaciones": hab,
                "precio_maximo": precio
            };
            console.log("Datos capturados del buscador:", searchData);

            // Mensaje UI de simulación de éxito
            $feedback.addClass('alert alert-success d-block').html('Búsqueda procesada. Revisa la consola para los datos. <br> (Se integrarían los resultados aquí)');
            
            // Restaurar estilo botón
            btn.prop('disabled', false).html('Buscar <i class="fa fa-search ml-2"></i>');
        }, 1200);
    });

    // Inicializar tooltips via Bootstrap (Opcional)
    // $('[data-toggle="tooltip"]').tooltip();
});
