import { listAllProperties } from './props.js';

const properties = [
    {
        id: 1,
        title: "Apartamento Lujo El Poblado",
        location: "El Poblado",
        type: "Casa",
        status: "En Venta",
        price: 950000000 ,
        currency: "COP",
        image: "img/destination-1.png",
        bedrooms: 3,
        bathrooms: 3,
        garage: 2,
        area: 300,
        description: "Magnifico apartamento ubicado en el corazón del Poblado. Diseñado con los mejores acabados y materiales de calidad premium. Cuenta con vista panorámica a la ciudad.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 3 },
            { icon: "fa-bath", label: "Baños", value: 3 },
            { icon: "fa-car", label: "Garajes", value: 2 },
            { icon: "fa-ruler-combined", label: "Área", value: "300 m²" },
            { icon: "fa-tree", label: "Terraza", value: "Sí" },
            { icon: "fa-swimming-pool", label: "Piscina", value: "Privada" },
            { icon: "fa-dumbbell", label: "Gimnasio", value: "Sí" },
            { icon: "fa-shield-alt", label: "Seguridad 24/7", value: "Sí" }
        ],
        amenities: [
            "Ascensor privado",
            "Cocina integrada",
            "Pisos en mármol",
            "Balcón panorámico",
            "Sistema de aire acondicionado",
            "Alarma de seguridad"
        ]
    },
    {
        id: 2,
        title: "La Blanca Señorial",
        location: "Laureles",
        type: "Casa",
        status: "En Venta",
        price: 849900000 ,
        currency: "COP",
        image: "img/destination-2.png",
        bedrooms: 4,
        bathrooms: 3,
        garage: 2,
        area: 220,
        description: "Hermosa casa ubicada en Laureles con amplios espacios. Ideal para familia. Cuenta con zonas verdes amplias y patio trasero.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 4 },
            { icon: "fa-bath", label: "Baños", value: 3 },
            { icon: "fa-car", label: "Garajes", value: 2 },
            { icon: "fa-ruler-combined", label: "Área", value: "220 m²" },
            { icon: "fa-tree", label: "Patio", value: "Grande" },
            { icon: "fa-leaf", label: "Zona Verde", value: "80 m²" },
            { icon: "fa-utensils", label: "Cocina-Comedor", value: "Integrada" },
            { icon: "fa-shield-alt", label: "Vigilancia", value: "Privada" }
        ],
        amenities: [
            "Patio trasero amplio",
            "Zona de lavandería",
            "Garaje cubierto",
            "Jardín frontal",
            "Teraza en azotea",
            "Despensa"
        ]
    },
    {
        id: 3,
        title: "Ranchito De Girasoles",
        location: "Envigado",
        type: "Casa Finca",
        status: "En Venta",
        price: 799999999,
        currency: "COP",
        image: "img/destination-3.png",
        bedrooms: 2,
        bathrooms: 2,
        garage: 1,
        area: 90,
        description: "Apartamento moderno con excelente ubicación en Envigado. Perfecto para parejas o profesionales independientes.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 2 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-car", label: "Garaje", value: 1 },
            { icon: "fa-ruler-combined", label: "Área", value: "100 m²" },
            { icon: "fa-swimming-pool", label: "Zona De Jardin", value: "Muy Grande" },
            { icon: "fa-shield-alt", label: "Vigilancia", value: "24/7" }
        ],
        amenities: [
            "Balcón con vista",
            "Sala-Comedor",
            "Cocina moderna",
            "Lavadora incorporada",
            "Aire acondicionado",
            "Zona de tendido"
        ]
    },
    {
        id: 4,
        title: "Apartamento Residencial",
        location: "Sabaneta",
        type: "Casa",
        status: "En Venta",
        price: 829999999,
        currency: "COP",
        image: "img/destination-4.png",
        bedrooms: 3,
        bathrooms: 2,
        garage: 1,
        area: 110,
        description: "Apartamento espacioso en zona residencial con todos los servicios incluidos. Cercano a colegios y centros comerciales.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 3 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-car", label: "Garaje", value: 1 },
            { icon: "fa-ruler-combined", label: "Área", value: "110 m²" },
            { icon: "fa-tree", label: "Balcón", value: "Sí" },
            { icon: "fa-parking", label: "Parqueadero Visitante", value: "Sí" },
            { icon: "fa-child", label: "Zona Infantil", value: "Sí" },
            { icon: "fa-shield-alt", label: "Control de Acceso", value: "Sí" }
        ],
        amenities: [
            "Cocina integral",
            "Comedor independiente",
            "Sala grande",
            "Zona de lavado",
            "Balcón amplio",
            "Closet en cada cuarto"
        ]
    },
    {
        id: 5,
        title: "Casa Unifamiliar",
        location: "Bello",
        type: "Casa",
        status: "En Venta",
        price: 1199999999,
        currency: "COP",
        image: "img/destination-5.png",
        bedrooms: 3,
        bathrooms: 2,
        garage: 1,
        area: 120,
        description: "Casa compacta en barrio residencial seguro. Ideal para familias nuevas que buscan comodidad y seguridad.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 4 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-car", label: "Garaje", value: 1 },
            { icon: "fa-ruler-combined", label: "Área", value: "120 m²" },
            { icon: "fa-tree", label: "Patio Trasero", value: "Sí" },
            { icon: "fa-leaf", label: "Jardín", value: "Frontal" },
            { icon: "fa-utensils", label: "Cocina", value: "Grande" },
            { icon: "fa-shield-alt", label: "Rejas de Seguridad", value: "Sí" }
        ],
        amenities: [
            "Patio grande",
            "Zona de lavandería",
            "Garaje techado",
            "Cocina amplia",
            "Despensa",
            "Acceso peatonal y vehicular"
        ]
    },
    {
        id: 6,
        title: "Casa Finca",
        location: "Rionegro",
        type: "Casa Finca",
        status: "En Venta",
        price: 899999990000,
        currency: "COP",
        image: "img/destination-6.png",
        bedrooms: 0,
        bathrooms: 0,
        garage: 0,
        area: 500,
        description: "Lote comercial ubicado en zona de alto tráfico. Perfecto para establecer tu negocio con gran visibilidad.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 3 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-ruler-combined", label: "Área", value: "500 m²" },
            { icon: "fa-road", label: "Frente a Calle Principal", value: "Sí" },
            { icon: "fa-parking", label: "Zona de Parqueo", value: "Disponible" },
            { icon: "fa-building", label: "Zonificación", value: "Comercial" },
            { icon: "fa-leaf", label: "Topografía", value: "Plana" }
        ],
        amenities: [
            "Acceso fácil",
            "Zona comercial consolidada",
            "Público transitado",
            "Servicios e instalaciones cercanas",
            "Andén y vías pavimentadas"
        ]
    },
    {
        id: 7,
        title: "Acogedor Apartamento",
        location: "Itagüí",
        type: "Apartamento",
        status: "En Venta",
        price: 1800000000,
        currency: "COP",
        image: "img/itagui.png",
        bedrooms: 3,
        bathrooms: 2,
        garage: 2,
        area: 75,
        description: "Apartamento compacto y funcional en Itagüí. Perfecto para estudiantes o personas que trabajan en la zona.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 3 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-car", label: "Garaje", value: 1 },
            { icon: "fa-ruler-combined", label: "Área", value: "125 m²" },
            { icon: "fa-tree", label: "Balcón", value: "Sí" },
            { icon: "fa-swimming-pool", label: "Piscina Común", value: "Sí" },
            { icon: "fa-dumbbell", label: "Zona Social", value: "Sí" },
            { icon: "fa-shield-alt", label: "Vigilancia", value: "Diurna" }
        ],
        amenities: [
            "Cocina equipada",
            "Sala-Comedor",
            "Balcón",
            "Zona de tendido",
            "Ascensor",
            "Área común"
        ]
    },
    {
        id: 8,
        title: "Amplia Casa Familiar",
        location: "La Estrella",
        type: "Casa",
        status: "En Venta",
        price: 999999999999,
        currency: "COP ",
        image: "img/estrella.png",
        bedrooms: 4,
        bathrooms: 2,
        garage: 2,
        area: 220,
        description: "Casa amplia y cómoda perfecta para familias numerosas. Todas las comodidades para una vida familiar plena.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 4 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-car", label: "Garajes", value: 2 },
            { icon: "fa-ruler-combined", label: "Área", value: "220 m²" },
            { icon: "fa-tree", label: "Patio Trasero", value: "Grande" },
            { icon: "fa-leaf", label: "Zona Verde", value: "Amplia" },
            { icon: "fa-utensils", label: "Cocina-Comedor", value: "Integrado" },
            { icon: "fa-shield-alt", label: "Vigilancia Privada", value: "Sí" }
        ],
        amenities: [
            "Patio con espacio para juego",
            "Garaje techado",
            "Área de servicio",
            "Jardín frontal y trasero",
            "Terraza",
            "Despensa"
        ]
    },
    {
        id: 9,
        title: "Zona Campestre",
        location: "Copacabana",
        type: "Terreno",
        status: "En Venta",
        price: 17999999999999,
        currency: "COP ",
        image: "img/copacabana  (1).png",
        bedrooms: 0,
        bathrooms: 0,
        garage: 0,
        area: 400,
        description: "Lote campestre en zona tranquila. Ideal para desarrollos, cultivos o construcción de vivienda nueva.",
        features: [
            { icon: "fa-bed", label: "Habitaciones", value: 5 },
            { icon: "fa-bath", label: "Baños", value: 2 },
            { icon: "fa-car", label: "Garajes", value: 2 },
            { icon: "fa-ruler-combined", label: "Área", value: "400 m²" },
            { icon: "fa-tree", label: "Tipo de Terreno", value: "Campestre" },
            { icon: "fa-water", label: "Acceso a Agua", value: "Sí" },
            { icon: "fa-swimming-pool", label: "Piscina Común", value: "Sí" },
            { icon: "fa-road", label: "Acceso Vehicular", value: "Sí" },
            { icon: "fa-leaf", label: "Topografía", value: "Semi-plana" },
            { icon: "fa-sun", label: "Soleado", value: "Sí" }
        ],
        amenities: [
            "Tranquilidad rural",
            "Aire puro",
            "Acceso fácil",
            "Servicios municipales",
            "Zona agroproductiva"
        ]
    }
];

function getPropertyFeatures(property) {
    if (Array.isArray(property.features) && property.features.length > 0) {
        return property.features;
    }

    return [
        { icon: 'fa-bed', label: 'Habitaciones', value: property.bedrooms || 0 },
        { icon: 'fa-bath', label: 'Baños', value: property.bathrooms || 0 },
        { icon: 'fa-car', label: 'Garaje', value: property.garage || 0 },
        { icon: 'fa-ruler-combined', label: 'Área', value: property.area ? `${property.area} m²` : 'No especificada' },
        { icon: 'fa-map-marker-alt', label: 'Ubicación', value: property.location || 'No especificada' },
        { icon: 'fa-tag', label: 'Tipo', value: property.type || 'Propiedad' },
    ];
}

function getPropertyAmenities(property) {
    if (Array.isArray(property.amenities) && property.amenities.length > 0) {
        return property.amenities;
    }

    return [
        property.type || 'Propiedad',
        property.location || 'Ubicación disponible',
        'Consulta con nuestro equipo para más detalles'
    ];
}

async function loadProperty() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    const allProperties = await listAllProperties();
    const property = [...allProperties, ...properties].find(p => String(p.id) === String(propertyId));

    if (!property) {
        document.getElementById('property-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Propiedad no encontrada</h4>
                <p>Lo sentimos, la propiedad que buscas no existe. <a href="index.html" class="alert-link">Volver al inicio</a></p>
            </div>
        `;
        return;
    }

    const imageSrc = property.imageUrl || property.image || 'img/placeholder.png';
    const title = property.title || 'Propiedad';
    const location = property.location || 'Ubicación no especificada';
    const price = Number(property.price || 0);
    const type = property.type || 'Propiedad';
    const status = property.status || 'En Venta';
    const description = property.description || 'Descripción no disponible por el momento.';
    const features = getPropertyFeatures(property);
    const amenities = getPropertyAmenities(property);

    const html = `
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div class="mb-4">
                    <img src="${imageSrc}" alt="${title}" class="img-fluid rounded-lg shadow-lg" style="max-height: 500px; object-fit: cover; width: 100%;">
                </div>

                <div class="bg-white p-5 rounded-lg shadow-sm mb-4">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h1 class="text-dark font-weight-bold mb-2">${title}</h1>
                            <p class="text-muted mb-0"><i class="fa fa-map-marker-alt text-primary mr-2"></i>${location}</p>
                        </div>
                        <div class="text-right">
                            <div class="badge badge-primary p-2 mb-2">${type}</div>
                            <br>
                            <div class="badge badge-${status === 'Venta' ? 'success' : 'info'} p-2">${status}</div>
                        </div>
                    </div>

                    <hr>

                    <div class="mb-4">
                        <h2 class="text-primary font-weight-bold mb-3">
                            $${price.toLocaleString('es-CO')} <span class="small text-muted">COP</span>
                        </h2>
                    </div>

                    <h5 class="font-weight-bold mb-3">Descripción</h5>
                    <p class="text-muted lead">${description}</p>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-sm mb-4">
                    <h4 class="font-weight-bold mb-4">Características</h4>
                    <div class="row">
                        ${features.map(feature => `
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="fas ${feature.icon} text-primary fa-lg mr-3" style="min-width: 30px;"></i>
                                    <div>
                                        <p class="mb-0 text-muted small">${feature.label}</p>
                                        <strong class="text-dark">${feature.value}</strong>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-sm">
                    <h4 class="font-weight-bold mb-4">Comodidades</h4>
                    <ul class="list-unstyled">
                        ${amenities.map(amenity => `
                            <li class="mb-2">
                                <i class="fas fa-check text-primary mr-2"></i>
                                <span class="text-dark">${amenity}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="bg-primary text-white p-4 rounded-lg shadow-sm mb-4">
                    <h5 class="font-weight-bold mb-4">¿Interesado en esta propiedad?</h5>
                    <form>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Tu nombre" required>
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" placeholder="Tu correo" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" class="form-control" placeholder="Tu teléfono" required>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" rows="4" placeholder="Tu mensaje" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-light btn-block font-weight-bold">Enviar Consulta</button>
                    </form>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <h5 class="font-weight-bold mb-3 text-dark">Información de Contacto</h5>
                    <div class="mb-3">
                        <p class="mb-1 text-muted"><small>Teléfono</small></p>
                        <p class="text-dark font-weight-bold">+57 (4) XXX-XXXX</p>
                    </div>
                    <div class="mb-3">
                        <p class="mb-1 text-muted"><small>Correo</small></p>
                        <p class="text-dark font-weight-bold">info@manuela.com</p>
                    </div>
                    <div>
                        <p class="mb-1 text-muted"><small>Ubicación</small></p>
                        <p class="text-dark font-weight-bold">Medellín, Colombia</p>
                    </div>
                </div>

                <div class="bg-light p-4 rounded-lg">
                    <h5 class="font-weight-bold mb-3 text-dark">Compartir</h5>
                    <div class="d-flex gap-2">
                        <a href="#" class="btn btn-sm btn-primary rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="btn btn-sm btn-info rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="fab fa-whatsapp"></i></a>
                        <a href="#" class="btn btn-sm btn-secondary rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('property-container').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadProperty);
