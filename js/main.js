document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el usuario guardado
    const usuarioGuardado = localStorage.getItem('usuarioMangaVerse');

    // Si hay un usuario logueado
    if (usuarioGuardado) {
        // Selecciona el enlace a Mi cuenta/Login
        const enlacesUser = document.querySelectorAll('a[href="mi-cuenta.html"], a[href="login.html"]');

        enlacesUser.forEach(enlace => {
            // Cambia el enlace a "mi-cuenta-html" una vez inicias sesion
            enlace.href = 'mi-cuenta.html';

            // Cambia "Mi cuenta" a el nombre de usuario
            const textoSpan = enlace.querySelector('span');
            if (textoSpan) {
                textoSpan.textContent = usuarioGuardado;
            }
        });
    }

    // Formulario inicio sesion
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

    // Boton cerrar sesion
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            localStorage.removeItem('usuarioMangaVerse');
            window.location.href = 'login.html';
        });
    }
});