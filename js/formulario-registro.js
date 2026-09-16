// VALIDACIÓN Y REGISTRO DE USUARIOS
const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Captura de campos según los IDs de tu HTML
        const nombre = document.getElementById('reg-nombre').value.trim();
        const apellido = document.getElementById('reg-apellido').value.trim();
        const usuario = document.getElementById('reg-usuario').value.trim();
        const correo = document.getElementById('reg-correo').value.trim();
        const fecha = document.getElementById('reg-fecha').value;
        const pass = document.getElementById('reg-contrasena').value;
        const confirmPass = document.getElementById('reg-confirmar-contrasena').value;

        // 2. Validación: Las contraseñas deben coincidir
        if (pass !== confirmPass) {
            alert("Las contraseñas no coinciden. Por favor inténtalo de nuevo.");
            return;
        }

        // 3. Obtener cuentas previas para comprobar nombres existentes
        const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
        const cuentaUnica = JSON.parse(localStorage.getItem('cuentaRegistrada'));

        // 4. Validación: El nombre de usuario no debe estar repetido (sin distinguir mayúsculas)
        const usuarioExiste = cuentasGuardadas.some(c => c.usuario.toLowerCase() === usuario.toLowerCase()) ||
                             (cuentaUnica && cuentaUnica.usuario.toLowerCase() === usuario.toLowerCase());

        if (usuarioExiste) {
            alert("El nombre de usuario ya está registrado. Por favor elige otro.");
            return;
        }

        // 5. Creación del objeto de usuario
        const nuevaCuenta = {
            nombre,
            apellido,
            usuario,
            correo,
            fecha,
            pass
        };

        // 6. Guardar en localStorage con la clave que usa tu login
        localStorage.setItem('cuentaRegistrada', JSON.stringify(nuevaCuenta));

        // Actualizar array histórico de usuarios
        cuentasGuardadas.push(nuevaCuenta);
        localStorage.setItem('cuentasMangaVerse', JSON.stringify(cuentasGuardadas));

        // 7. Feedback y redirección
        alert("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...");
        window.location.href = 'login.html';
    });
}