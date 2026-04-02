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
            
            // Cerrar menú responsivo en celular al hacer clic en un link
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

    // 2.1 Rotación dinámica de placeholders para el buscador
    const locationExamples = [
        "Mansión en Santa Fe",
        "Apartamento en Itagüí",
        "Casa en Medellín",
        "Penthouse en El Poblado",
        "Lote en Llano Grande",
        "Apartaestudio en Laureles"
    ];

    let currentIdx = 0;
    const $ubicacionInput = $('#ubicacionInput');

    if ($ubicacionInput.length) {
        setInterval(() => {
            currentIdx = (currentIdx + 1) % locationExamples.length;
            $ubicacionInput.attr('placeholder', `Ej: ${locationExamples[currentIdx]}`);
        }, 2500);
    }

    // 3. Manejo funcional del Formulario (Búsqueda en Vivo)
    function filterProperties() {
        var ubicacion = $('#ubicacionInput').val().toLowerCase().trim();
        var tipo = $('#tipo').val();
        var hab = $('#habitaciones').val();
        var precioMaximo = $('#precio').val();

        var matchesFound = 0;

        $('.property-item').each(function() {
            var item = $(this);
            var itemUbicacion = item.data('ubicacion').toString().toLowerCase();
            var itemTipo = item.data('tipo').toString();
            var itemHabitaciones = parseInt(item.data('habitaciones'));
            var itemPrecio = parseInt(item.data('precio'));

            var isMatch = true;

            // 1. Filtro Ubicación (búsqueda en vivo de subcadenas)
            if (ubicacion !== "" && !itemUbicacion.includes(ubicacion)) {
                isMatch = false;
            }

            // 2. Filtro Tipo
            if (tipo !== "" && itemTipo !== tipo) {
                isMatch = false;
            }

            // 3. Filtro Habitaciones
            if (hab !== "todas" && itemHabitaciones < parseInt(hab)) {
                isMatch = false;
            }

            // 4. Filtro Precio
            if (precioMaximo !== "ilimitado" && itemPrecio > parseInt(precioMaximo)) {
                isMatch = false;
            }

            // Mostrar u ocultar
            if (isMatch) {
                item.removeClass('d-none');
                matchesFound++;
            } else {
                item.addClass('d-none');
            }
        });

        // Feedback al usuario
        var $feedback = $('#search-feedback');
        $feedback.removeClass('d-none alert-success alert-danger alert-info').empty();
        if (matchesFound > 0) {
            $feedback.addClass('alert alert-success d-block').html(`¡Encontramos ${matchesFound} propiedad(es)!`);
        } else {
            $feedback.addClass('alert alert-info d-block').html('No encontramos propiedades. Intenta cambiar los filtros.');
        }
    }

    // Escuchar eventos de teclado y cambios en el form
    $('#ubicacionInput').on('input', filterProperties);
    $('#tipo, #habitaciones, #precio').on('change', filterProperties);

    $('#searchForm').on('submit', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#destacadas").offset().top - 70
        }, 800);
    });


});
