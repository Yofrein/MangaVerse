document.addEventListener('DOMContentLoaded', function() {
    // 1. Ver si hay una sesión activa con la clave exacta
    const usuarioActivo = localStorage.getItem('usuarioMangaVerse');

    if (usuarioActivo) {
        const enlacesUser = document.querySelectorAll('a[href="mi-cuenta.html"], a[href="login.html"]');
        enlacesUser.forEach(enlace => {
            enlace.href = 'mi-cuenta.html';
            
            // Cambia el texto "Mi cuenta" al nombre del usuario
            const textoSpan = enlace.querySelector('span');
            if (textoSpan) {
                textoSpan.textContent = usuarioActivo;
            }
        });
    } else {
        // Si no hay sesión, asegura que el icono User.png se vea blanco
        const iconosUser = document.querySelectorAll('.nav-icon');
        iconosUser.forEach(icono => {
            if (icono.src.includes('User.png')) {
                icono.style.filter = 'invert(100%)';
            }
        });
    }

    // 2. REGISTRO: Guarda la cuenta y manda a login.html sin activar sesión
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('reg-usuario').value.trim();
            const password = document.getElementById('reg-password').value;

            if (nombre !== "" && password !== "") {
                const cuenta = { usuario: nombre, pass: password };
                localStorage.setItem('cuentaRegistrada', JSON.stringify(cuenta));
                window.location.href = 'login.html';
            }
        });
    }

    // 3. LOGIN: Valida e inicia la sesión usando la clave 'usuarioMangaVerse'
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombreIngresado = document.getElementById('usuario').value.trim();
            const passwordIngresada = document.getElementById('password').value;

            const cuentaGuardada = JSON.parse(localStorage.getItem('cuentaRegistrada'));

            if (!cuentaGuardada) {
                alert("No existe ninguna cuenta registrada. Por favor regístrate primero.");
                return;
            }

            if (nombreIngresado === cuentaGuardada.usuario && passwordIngresada === cuentaGuardada.pass) {
                // Guarda con la clave que reconoce mi-cuenta.html
                localStorage.setItem('usuarioMangaVerse', nombreIngresado);
                window.location.href = 'mi-cuenta.html';
            } else {
                alert("Usuario o contraseña incorrectos. Intenta nuevamente.");
            }
        });
    }

    // 4. CERRAR SESIÓN: Elimina la clave y regresa al login
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            localStorage.removeItem('usuarioMangaVerse');
            window.location.href = 'login.html';
        });
    }

// 5. NOTIFICACIÓN FLOTANTE (Toast) AL AÑADIR AL CARRITO
    const botonesCarrito = document.querySelectorAll('.anadir-carrito, .anadir-carrito-chico');
    const toast = document.getElementById('toast-notificacion');
    const toastNombre = document.getElementById('toast-producto-nombre');
    let toastTimeout;

    if (botonesCarrito.length > 0 && toast) {
        botonesCarrito.forEach(boton => {
            boton.addEventListener('click', function() {
                const tarjeta = this.closest('.recuadro-mangas, .recuadro-mangas-masvendidos, .card-manga');
                
                if (tarjeta) {
                    const elementoTitulo = tarjeta.querySelector('h1') || tarjeta.querySelector('h3');
                    
                    if (elementoTitulo) {
                        toastNombre.textContent = elementoTitulo.textContent.trim();
                    }
                }

                // Mostrar la notificación
                toast.classList.add('mostrar');

                // Reiniciar el temporizador si se vuelve a presionar rápido
                clearTimeout(toastTimeout);

                // Ocultar la notificación después de 3 segundos
                toastTimeout = setTimeout(() => {
                    toast.classList.remove('mostrar');
                }, 3000);
            });
        });
    }

    // 6. BUSCADOR FUNCIONAL (En tiempo real y con redirección al catálogo)
    const inputsBusqueda = document.querySelectorAll('.search-input');
    const botonesBusqueda = document.querySelectorAll('.search-btn');

    // Función para filtrar las tarjetas dentro del catálogo
    function filtrarCatalogo(termino) {
        const tarjetas = document.querySelectorAll('.card-manga, .recuadro-mangas, .recuadro-mangas-masvendidos');
        const terminoLimpio = termino.toLowerCase().trim();

        tarjetas.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('h1') || tarjeta.querySelector('h3');
            if (titulo) {
                const textoTitulo = titulo.textContent.toLowerCase();
                if (textoTitulo.includes(terminoLimpio)) {
                    tarjeta.style.display = ""; // Muestra la tarjeta
                } else {
                    tarjeta.style.display = "none"; // Oculta la tarjeta
                }
            }
        });
    }

    // Ejecutar búsqueda o redirección según corresponda
    function ejecutarBusqueda(valor) {
        const esPaginaCatalogo = window.location.pathname.includes('catalogo.html');

        if (esPaginaCatalogo) {
            filtrarCatalogo(valor);
        } else if (valor.trim() !== "") {
            // Si estamos en Inicio/Contacto, redirige al catálogo con el parámetro de búsqueda
            window.location.href = `catalogo.html?buscar=${encodeURIComponent(valor.trim())}`;
        }
    }

    // Eventos para escribir en vivo y presionar Enter
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

    // Evento para el botón de la lupa
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

    // Leer parámetro URL al cargar la página si venimos desde Inicio
    const urlParams = new URLSearchParams(window.location.search);
    const busquedaURL = urlParams.get('buscar');
    if (busquedaURL && window.location.pathname.includes('catalogo.html')) {
        const inputCatalogo = document.querySelector('.search-input');
        if (inputCatalogo) {
            inputCatalogo.value = busquedaURL;
        }
        filtrarCatalogo(busquedaURL);
    }
});