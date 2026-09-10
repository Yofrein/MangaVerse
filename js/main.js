document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener el usuario guardado
    const usuarioGuardado = localStorage.getItem('usuarioMangaVerse');

    // 2. Si HAY usuario logueado:
    if (usuarioGuardado) {
        // Seleccionamos el enlace a Mi Cuenta / Login
        const enlacesUser = document.querySelectorAll('a[href="mi-cuenta.html"], a[href="login.html"]');

        enlacesUser.forEach(enlace => {
            // Cambiamos el destino del enlace para que siempre vaya a mi-cuenta.html
            enlace.href = 'mi-cuenta.html';

            // Cambiamos el texto "Mi cuenta" por el nombre del usuario
            const textoSpan = enlace.querySelector('span');
            if (textoSpan) {
                textoSpan.textContent = usuarioGuardado;
            }
        });
    }

    // 3. Lógica para el formulario de Login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombreUsuario = document.getElementById('usuario').value;
            
            if (nombreUsuario.trim() !== "") {
                localStorage.setItem('usuarioMangaVerse', nombreUsuario);
                window.location.href = 'mi-cuenta.html';
            }
        });
    }

    // 4. Lógica para el botón de Cerrar Sesión
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            localStorage.removeItem('usuarioMangaVerse');
            window.location.href = 'login.html';
        });
    }
});