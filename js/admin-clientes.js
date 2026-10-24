document.addEventListener('DOMContentLoaded', function() {
    const tbodyClientes = document.getElementById('tabla-clientes-body');
    if (!tbodyClientes) return;

    function cargarClientes() {
        // Obtener cuentas almacenadas en el localStorage
        const cuentasGuardadas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
        tbodyClientes.innerHTML = "";

        if (cuentasGuardadas.length === 0) {
            tbodyClientes.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No hay clientes registrados actualmente.</td></tr>`;
            return;
        }

        cuentasGuardadas.forEach((cuenta, index) => {
            const tr = document.createElement('tr');

            const idFormateado = `#${String(index + 1).padStart(2, '0')}`;
            const nombreCompleto = `${cuenta.nombre || ''} ${cuenta.apellido || ''} (${cuenta.usuario || 'Sin usuario'})`.trim();
            const correo = cuenta.correo || 'Sin correo';
            const esAdmin = cuenta.rol === 'admin';

            tr.innerHTML = `
                <td><strong>${idFormateado}</strong></td>
                <td>${nombreCompleto}</td>
                <td>${correo}</td>
                <td>
                    ${esAdmin 
                        ? '<span style="color: rgb(128, 44, 206); font-weight: bold;">Administrador</span>' 
                        : 'Cliente'}
                </td>
                <td>
                    ${esAdmin 
                        ? '<span style="color: #888; font-size: 13px;">Sistema</span>' 
                        : `<button class="btn-accion eliminar btn-eliminar-cliente" data-usuario="${cuenta.usuario}">Eliminar</button>`}
                </td>
            `;

            tbodyClientes.appendChild(tr);
        });

        // Activar botones de eliminar cliente
        const botonesEliminar = document.querySelectorAll('.btn-eliminar-cliente');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function() {
                const usuarioAEliminar = this.getAttribute('data-usuario');
                
                if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${usuarioAEliminar}"?`)) {
                    let cuentas = JSON.parse(localStorage.getItem('cuentasMangaVerse')) || [];
                    cuentas = cuentas.filter(c => c.usuario !== usuarioAEliminar);
                    
                    localStorage.setItem('cuentasMangaVerse', JSON.stringify(cuentas));
                    
                    // Recargar la tabla
                    cargarClientes();
                }
            });
        });
    }

    // Cargar al iniciar la página
    cargarClientes();
});