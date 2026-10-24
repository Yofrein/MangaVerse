document.addEventListener('DOMContentLoaded', function() {
    const usuarioActivoNombre = localStorage.getItem('usuarioMangaVerse');
    if (!usuarioActivoNombre) return;

    // Referencias a los inputs del perfil
    const inputNombre = document.getElementById('cuenta-nombre');
    const inputApellido = document.getElementById('cuenta-apellido');
    const inputUsuario = document.getElementById('cuenta-usuario');
    const inputCorreo = document.getElementById('cuenta-correo');
    const inputFecha = document.getElementById('cuenta-fecha');
    const formActualizar = document.getElementById('form-actualizar-cuenta');

    // Cargar datos actuales del usuario en el formulario
    const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
    const cuentaUnica = JSON.parse(localStorage.getItem('cuentaRegistrada'));

    let usuarioEncontrado = cuentasGuardadas.find(c => c.usuario === usuarioActivoNombre);
    if (!usuarioEncontrado && cuentaUnica && cuentaUnica.usuario === usuarioActivoNombre) {
        usuarioEncontrado = cuentaUnica;
    }

    if (usuarioEncontrado) {
        // Asignación segura contemplando posibles variaciones en las propiedades del objeto
        if (inputNombre) inputNombre.value = usuarioEncontrado.nombre || usuarioEncontrado.nombres || "";
        
        // Corrección clave para el apellido (verifica 'apellido' o 'apellidos')
        if (inputApellido) inputApellido.value = usuarioEncontrado.apellido || usuarioEncontrado.apellidos || "";
        
        if (inputUsuario) inputUsuario.value = usuarioEncontrado.usuario || usuarioEncontrado.username || "";
        if (inputCorreo) inputCorreo.value = usuarioEncontrado.correo || usuarioEncontrado.email || "";
        if (inputFecha) inputFecha.value = usuarioEncontrado.fecha || usuarioEncontrado.fechaNacimiento || "";
    }

    // Manejar el evento de guardar cambios del perfil
    if (formActualizar) {
        formActualizar.addEventListener('submit', function(e) {
            e.preventDefault();

            const nuevoUsuario = inputUsuario.value.trim();
            const nuevoCorreo = inputCorreo.value.trim();

            if (!nuevoUsuario || !nuevoCorreo) {
                mostrarAlertaFormulario("Los campos de usuario y correo no pueden estar vacíos.");
                return;
            }

            // Validar si el nombre de usuario ya está ocupado por otro
            const nombreOcupado = cuentasGuardadas.some(c => c.usuario.toLowerCase() === nuevoUsuario.toLowerCase() && c.usuario !== usuarioActivoNombre);
            
            if (nombreOcupado) {
                mostrarAlertaFormulario("El nombre de usuario ya está en uso por otra cuenta.");
                return;
            }

            if (usuarioEncontrado) {
                usuarioEncontrado.usuario = nuevoUsuario;
                usuarioEncontrado.correo = nuevoCorreo;
            }

            // Actualizar la lista en el localStorage
            const index = cuentasGuardadas.findIndex(c => c.usuario === usuarioActivoNombre || (usuarioEncontrado && c.correo === usuarioEncontrado.correo));
            if (index !== -1) {
                cuentasGuardadas[index] = usuarioEncontrado;
            }
            localStorage.setItem('cuentasMangaVerse', JSON.stringify(cuentasGuardadas));

            if (cuentaUnica && cuentaUnica.usuario === usuarioActivoNombre) {
                cuentaUnica.usuario = nuevoUsuario;
                cuentaUnica.correo = nuevoCorreo;
                localStorage.setItem('cuentaRegistrada', JSON.stringify(cuentaUnica));
            }

            // Actualizar sesión activa
            localStorage.setItem('usuarioMangaVerse', nuevoUsuario);

            mostrarAlertaFormulario("¡Datos actualizados correctamente!", true);
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        });
    }
});