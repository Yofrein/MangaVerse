// ==========================================
// UTILIDAD GLOBAL: Alertas en Formularios
// ==========================================
function mostrarAlertaFormulario(mensaje, esExito = false) {
    const alertaBox = document.getElementById('alerta-box');
    if (alertaBox) {
        alertaBox.textContent = mensaje;
        alertaBox.className = 'mensaje-alerta ' + (esExito ? 'alerta-exito' : 'alerta-error');
        alertaBox.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 0. Inicializar usuario administrador por defecto
    inicializarAdminPorDefecto();

    // 1. Configurar sesión activa y enlaces superiores según rol
    gestionarSesionYNavegacion();

    // 3. Login
    inicializarFormularioLogin();

    // 4. Cerrar sesión
    inicializarCerrarSesion();

    // 5. Carrito / Notificaciones Toast
    inicializarNotificacionesCarrito();

    // 6. Buscador global
    inicializarBuscadorGlobal();

});

// ==========================================
// FUNCIONES GLOBALES
// ==========================================

function inicializarAdminPorDefecto() {
    const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
    const existeAdmin = cuentasGuardadas.some(c => c.usuario === "admin");
    
    if (!existeAdmin) {
        const cuentaAdmin = {
            nombre: "Administrador",
            apellido: "MangaVerse",
            usuario: "admin",
            pass: "admin123",
            correo: "admin@mangaverse.cl",
            fecha: "2026-01-01",
            rol: "admin"
        };
        cuentasGuardadas.push(cuentaAdmin);
        localStorage.setItem('cuentasMangaVerse', JSON.stringify(cuentasGuardadas));
    }
}

function gestionarSesionYNavegacion() {
    const usuarioActivoNombre = localStorage.getItem('usuarioMangaVerse');

    if (usuarioActivoNombre) {
        const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
        const cuentaUnica = JSON.parse(localStorage.getItem('cuentaRegistrada'));

        let usuarioActualObj = cuentasGuardadas.find(c => c.usuario === usuarioActivoNombre);
        if (!usuarioActualObj && cuentaUnica && cuentaUnica.usuario === usuarioActivoNombre) {
            usuarioActualObj = cuentaUnica;
        }

        const enlacesUser = document.querySelectorAll('a[href="mi-cuenta.html"], a[href="login.html"], a[href="admin.html"]');
        
        enlacesUser.forEach(enlace => {
            const textoSpan = enlace.querySelector('span');
            if (textoSpan) {
                textoSpan.textContent = usuarioActivoNombre;
            }

            if (usuarioActualObj && usuarioActualObj.rol === 'admin') {
                enlace.href = 'admin.html';
            } else {
                enlace.href = 'mi-cuenta.html';
            }
        });
    } else {
        const iconosUser = document.querySelectorAll('.nav-icon');
        iconosUser.forEach(icono => {
            if (icono.src.includes('User.png')) {
                icono.style.filter = 'invert(100%)';
            }
        });
    }
}

function inicializarFormularioLogin() {
    const formLogin = document.getElementById('form-login');
    if (!formLogin) return;

    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombreIngresado = document.getElementById('usuario').value.trim();
        const passwordIngresada = document.getElementById('password').value;

        const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
        const cuentaUnica = JSON.parse(localStorage.getItem('cuentaRegistrada'));

        let usuarioEncontrado = cuentasGuardadas.find(c => c.usuario === nombreIngresado && c.pass === passwordIngresada);

        if (!usuarioEncontrado && cuentaUnica && cuentaUnica.usuario === nombreIngresado && cuentaUnica.pass === passwordIngresada) {
            usuarioEncontrado = cuentaUnica;
        }

        if (!usuarioEncontrado) {
            mostrarAlertaFormulario("Usuario o contraseña incorrectos. Intenta nuevamente.");
            return;
        }

        localStorage.setItem('usuarioMangaVerse', usuarioEncontrado.usuario);

        if (usuarioEncontrado.rol === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'mi-cuenta.html';
        }
    });
}

function inicializarCerrarSesion() {
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (!btnCerrarSesion) return;

    btnCerrarSesion.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('usuarioMangaVerse');
        window.location.href = 'login.html';
    });
}

function inicializarNotificacionesCarrito() {
    const botonesCarrito = document.querySelectorAll('.anadir-carrito, .anadir-carrito-chico');
    const toast = document.getElementById('toast-notificacion');
    const toastNombre = document.getElementById('toast-producto-nombre');
    let toastTimeout;

    if (botonesCarrito.length === 0 || !toast) return;

    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', function() {
            const tarjeta = this.closest('.recuadro-mangas, .recuadro-mangas-masvendidos, .card-manga');
            
            if (tarjeta) {
                const elementoTitulo = tarjeta.querySelector('h1') || tarjeta.querySelector('h3');
                if (elementoTitulo && toastNombre) {
                    toastNombre.textContent = elementoTitulo.textContent.trim();
                }
            }

            toast.classList.add('mostrar');
            clearTimeout(toastTimeout);

            toastTimeout = setTimeout(() => {
                toast.classList.remove('mostrar');
            }, 3000);
        });
    });
}

function inicializarBuscadorGlobal() {
    const inputsBusqueda = document.querySelectorAll('.search-input');
    const botonesBusqueda = document.querySelectorAll('.search-btn');

    if (inputsBusqueda.length === 0) return;

    function filtrarCatalogo(termino) {
        const tarjetas = document.querySelectorAll('.card-manga, .recuadro-mangas, .recuadro-mangas-masvendidos');
        const terminoLimpio = termino.toLowerCase().trim();

        tarjetas.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('h1') || tarjeta.querySelector('h3');
            if (titulo) {
                const textoTitulo = titulo.textContent.toLowerCase();
                if (textoTitulo.includes(terminoLimpio)) {
                    tarjeta.style.display = "";
                } else {
                    tarjeta.style.display = "none";
                }
            }
        });
    }

    function ejecutarBusqueda(valor) {
        const esPaginaCatalogo = window.location.pathname.includes('catalogo.html');

        if (esPaginaCatalogo) {
            filtrarCatalogo(valor);
        } else if (valor.trim() !== "") {
            window.location.href = `catalogo.html?buscar=${encodeURIComponent(valor.trim())}`;
        }
    }

    inputsBusqueda.forEach(input => {
        input.addEventListener('input', function() {
            if (window.location.pathname.includes('catalogo.html')) {
                filtrarCatalogo(this.value);
            }
        });

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                ejecutarBusqueda(this.value);
            }
        });
    });

    botonesBusqueda.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const contenedorBusqueda = this.closest('.search-box');
            if (contenedorBusqueda) {
                const input = contenedorBusqueda.querySelector('.search-input');
                if (input) {
                    ejecutarBusqueda(input.value);
                }
            }
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const busquedaURL = urlParams.get('buscar');
    if (busquedaURL && window.location.pathname.includes('catalogo.html')) {
        const inputCatalogo = document.querySelector('.search-input');
        if (inputCatalogo) {
            inputCatalogo.value = busquedaURL;
        }
        filtrarCatalogo(busquedaURL);
    }
}