document.addEventListener('DOMContentLoaded', function() {
    const tbodyCupones = document.getElementById('tabla-cupones-body');
    const btnCrearCupon = document.getElementById('btn-crear-cupon');
    const modalCupon = document.getElementById('modal-cupon');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const formCrearCupon = document.getElementById('form-crear-cupon');

    if (!tbodyCupones) return;

    function obtenerCupones() {
        let cupones = JSON.parse(localStorage.getItem('cuponesMangaVerse'));
        if (!cupones) {
            cupones = [];
            localStorage.setItem('cuponesMangaVerse', JSON.stringify(cupones));
        }
        return cupones;
    }

    function guardarCupones(cupones) {
        localStorage.setItem('cuponesMangaVerse', JSON.stringify(cupones));
    }

    // Función auxiliar para formatear la fecha de AAAA-MM-DD a DD/MM/AAAA (más legible)
    function formatearFecha(fechaStr) {
        if (!fechaStr) return '';
        const partes = fechaStr.split('-');
        if (partes.length !== 3) return fechaStr;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function cargarCupones() {
        const cupones = obtenerCupones();
        tbodyCupones.innerHTML = "";

        if (cupones.length === 0) {
            tbodyCupones.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No hay cupones registrados actualmente.</td></tr>`;
            return;
        }

        cupones.forEach((cupon, index) => {
            const tr = document.createElement('tr');
            const esActivo = cupon.estado === "Activo";

            const inicioFormateado = formatearFecha(cupon.inicio);
            const vencimientoFormateado = formatearFecha(cupon.vencimiento);

            tr.innerHTML = `
                <td><strong>${cupon.codigo}</strong></td>
                <td>${cupon.descuento}</td>
                <td>${inicioFormateado} al ${vencimientoFormateado}</td>
                <td><span class="estado-cupon ${esActivo ? 'estado-activo' : 'estado-expirado'}">${cupon.estado}</span></td>
                <td>
                    <button type="button" class="btn-accion editar btn-cambiar-estado" data-index="${index}">${esActivo ? 'Desactivar' : 'Activar'}</button>
                    <button type="button" class="btn-accion eliminar btn-eliminar-cupon" data-index="${index}">Eliminar</button>
                </td>
            `;

            tbodyCupones.appendChild(tr);
        });

        // Botones de cambiar estado
        document.querySelectorAll('.btn-cambiar-estado').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                let cupones = obtenerCupones();
                cupones[idx].estado = cupones[idx].estado === "Activo" ? "Expirado" : "Activo";
                guardarCupones(cupones);
                cargarCupones();
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.btn-eliminar-cupon').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                let cupones = obtenerCupones();
                
                if (confirm(`¿Estás seguro de eliminar el cupón "${cupones[idx].codigo}"?`)) {
                    cupones.splice(idx, 1);
                    guardarCupones(cupones);
                    cargarCupones();
                }
            });
        });
    }

    // Abrir el modal
    if (btnCrearCupon && modalCupon) {
        btnCrearCupon.addEventListener('click', function(e) {
            e.preventDefault();
            modalCupon.style.display = 'flex';
        });
    }

    // Cerrar el modal con el botón cancelar
    if (btnCancelarModal && modalCupon) {
        btnCancelarModal.addEventListener('click', function() {
            modalCupon.style.display = 'none';
            if (formCrearCupon) formCrearCupon.reset();
        });
    }

    // Guardar el cupón nuevo desde el formulario del modal
    if (formCrearCupon && modalCupon) {
        formCrearCupon.addEventListener('submit', function(e) {
            e.preventDefault();

            const codigoInput = document.getElementById('input-codigo');
            const descuentoInput = document.getElementById('input-descuento');
            const inicioInput = document.getElementById('input-inicio');
            const vencimientoInput = document.getElementById('input-vencimiento');

            if (!codigoInput || !descuentoInput || !inicioInput || !vencimientoInput) return;

            const codigo = codigoInput.value.toUpperCase().trim();
            const descuento = descuentoInput.value.trim();
            const inicio = inicioInput.value;
            const vencimiento = vencimientoInput.value;

            // Validación simple para asegurar que la fecha de vencimiento sea posterior a la de inicio
            if (vencimiento < inicio) {
                alert("La fecha de vencimiento no puede ser anterior a la fecha de inicio.");
                return;
            }

            let cupones = obtenerCupones();
            cupones.push({
                codigo: codigo,
                descuento: descuento,
                inicio: inicio,
                vencimiento: vencimiento,
                estado: "Activo"
            });

            guardarCupones(cupones);
            cargarCupones();

            // Cerrar modal y limpiar campos
            modalCupon.style.display = 'none';
            formCrearCupon.reset();
        });
    }

    // Cargar la tabla al iniciar
    cargarCupones();
});