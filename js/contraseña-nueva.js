document.addEventListener('DOMContentLoaded', function() {
    const formPassword = document.getElementById('form-cambiar-password');

    if (!formPassword) return;

    formPassword.addEventListener('submit', function(e) {
        e.preventDefault();

        const passAntiguaInput = document.getElementById('pass-antigua').value;
        const passNuevaInput = document.getElementById('pass-nueva').value;
        const passConfirmarInput = document.getElementById('pass-confirmar').value;

        // 1. Validar que la nueva y la confirmación coincidan
        if (passNuevaInput !== passConfirmarInput) {
            mostrarAlertaFormulario("Las nuevas contraseñas no coinciden. Por favor verifícalas.");
            return;
        }

        // 2. Obtener el usuario activo actual
        const usuarioActivoNombre = localStorage.getItem('usuarioMangaVerse');
        if (!usuarioActivoNombre) {
            mostrarAlertaFormulario("No hay una sesión activa. Inicia sesión nuevamente.");
            return;
        }

        const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
        const cuentaUnica = JSON.parse(localStorage.getItem('cuentaRegistrada'));

        // Buscar al usuario en las bases de datos locales
        let usuarioEncontrado = cuentasGuardadas.find(c => c.usuario === usuarioActivoNombre);
        if (!usuarioEncontrado && cuentaUnica && cuentaUnica.usuario === usuarioActivoNombre) {
            usuarioEncontrado = cuentaUnica;
        }

        if (!usuarioEncontrado) {
            mostrarAlertaFormulario("No se encontró el registro del usuario actual.");
            return;
        }

        // 3. Verificar si la contraseña antigua es correcta
        // (Soporta tanto la clave 'pass' como 'password' dependiendo de cómo se registró)
        const passwordReal = usuarioEncontrado.pass || usuarioEncontrado.password;

        if (passAntiguaInput !== passwordReal) {
            mostrarAlertaFormulario("La contraseña antigua es incorrecta.");
            return;
        }

        // 4. Actualizar la contraseña
        usuarioEncontrado.pass = passNuevaInput;
        if (usuarioEncontrado.password) {
            usuarioEncontrado.password = passNuevaInput;
        }

        // Actualizar la lista general en el localStorage
        const index = cuentasGuardadas.findIndex(c => c.usuario === usuarioActivoNombre);
        if (index !== -1) {
            cuentasGuardadas[index] = usuarioEncontrado;
            localStorage.setItem('cuentasMangaVerse', JSON.stringify(cuentasGuardadas));
        }

        // Actualizar cuenta única si aplica
        if (cuentaUnica && cuentaUnica.usuario === usuarioActivoNombre) {
            cuentaUnica.pass = passNuevaInput;
            localStorage.setItem('cuentaRegistrada', JSON.stringify(cuentaUnica));
        }

        // 5. Notificar éxito y limpiar o redirigir
        mostrarAlertaFormulario("¡Contraseña actualizada con éxito!", true);
        
        setTimeout(() => {
            formPassword.reset();
            window.location.href = 'mi-cuenta.html';
        }, 1500);
    });
});