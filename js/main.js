// Función global para mostrar alertas elegantes en los formularios
function mostrarAlertaFormulario(mensaje, esExito = false) {
    const alertaBox = document.getElementById('alerta-box');
    if (alertaBox) {
        alertaBox.textContent = mensaje;
        alertaBox.className = 'mensaje-alerta ' + (esExito ? 'alerta-exito' : 'alerta-error');
        alertaBox.style.display = 'block';
    }
}

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

    // 2. REGISTRO: Captura completa de campos, validación de contraseñas y alertas bonitas
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('reg-nombre') ? document.getElementById('reg-nombre').value.trim() : "";
            const apellido = document.getElementById('reg-apellido') ? document.getElementById('reg-apellido').value.trim() : "";
            const usuario = document.getElementById('reg-usuario').value.trim();
            const correo = document.getElementById('reg-correo').value.trim();
            const fecha = document.getElementById('reg-fecha') ? document.getElementById('reg-fecha').value : "";
            
            // Detecta ambos nombres de ID por si acaso
            const elPass = document.getElementById('reg-contrasena') || document.getElementById('reg-password');
            const elConfirmPass = document.getElementById('reg-confirmar-contrasena') || document.getElementById('reg-confirm-password');

            const pass = elPass ? elPass.value : "";
            const confirmPass = elConfirmPass ? elConfirmPass.value : pass;

            // Validación: Las contraseñas deben coincidir
            if (pass !== confirmPass) {
                mostrarAlertaFormulario("Las contraseñas no coinciden. Por favor inténtalo de nuevo.");
                return;
            }

            // Obtener cuentas previas para comprobar si el usuario ya existe
            const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
            const cuentaUnica = JSON.parse(localStorage.getItem('cuentaRegistrada'));

            const usuarioExiste = cuentasGuardadas.some(c => c.usuario.toLowerCase() === usuario.toLowerCase()) ||
                                  (cuentaUnica && cuentaUnica.usuario.toLowerCase() === usuario.toLowerCase());

            if (usuarioExiste) {
                mostrarAlertaFormulario("El nombre de usuario ya está registrado. Por favor elige otro.");
                return;
            }

            // Crear objeto de la nueva cuenta
            const nuevaCuenta = {
                nombre: nombre,
                apellido: apellido,
                usuario: usuario,
                pass: pass,
                correo: correo,
                fecha: fecha
            };

            // Guardar datos en localStorage
            localStorage.setItem('cuentaRegistrada', JSON.stringify(nuevaCuenta));
            cuentasGuardadas.push(nuevaCuenta);
            localStorage.setItem('cuentasMangaVerse', JSON.stringify(cuentasGuardadas));

            // Feedback visual exitoso y redirección suave
            mostrarAlertaFormulario("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...", true);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // 3. LOGIN: Valida e inicia sesión usando alertas bonitas
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombreIngresado = document.getElementById('usuario').value.trim();
            const passwordIngresada = document.getElementById('password').value;

            const cuentaGuardada = JSON.parse(localStorage.getItem('cuentaRegistrada'));

            if (!cuentaGuardada) {
                mostrarAlertaFormulario("No existe ninguna cuenta registrada. Por favor regístrate primero.");
                return;
            }

            if (nombreIngresado === cuentaGuardada.usuario && passwordIngresada === cuentaGuardada.pass) {
                localStorage.setItem('usuarioMangaVerse', nombreIngresado);
                window.location.href = 'mi-cuenta.html';
            } else {
                mostrarAlertaFormulario("Usuario o contraseña incorrectos. Intenta nuevamente.");
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

                toast.classList.add('mostrar');
                clearTimeout(toastTimeout);

                toastTimeout = setTimeout(() => {
                    toast.classList.remove('mostrar');
                }, 3000);
            });
        });
    }

    // 6. BUSCADOR FUNCIONAL
    const inputsBusqueda = document.querySelectorAll('.search-input');
    const botonesBusqueda = document.querySelectorAll('.search-btn');

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
});