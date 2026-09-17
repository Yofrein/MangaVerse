    // Boton para eliminar en carrito

    const tablaCarrito = document.querySelectorAll('.tabla-carrito td');
    tablaCarrito.forEach(boton => {
        boton.addEventListener('click', function() {
        const fila = this.closest('tr');
        if (fila) {
            fila.remove();
        actualizarTotales(); // Actualiza los totales después de eliminar un producto
        }
        });
    });

    function actualizarTotales() {
    let subtotal = 0;

    // 1. Buscamos todas las filas que quedan en la tabla
    const filasRestantes = document.querySelectorAll('.tabla-carrito tbody tr');
    filasRestantes.forEach(fila => {
        const celdaPrecio = fila.children[2].textContent;
        const precioNumero = parseInt(celdaPrecio.replace('$', '').replace(/\./g, ''));
        subtotal += precioNumero;
    });

    // 2. Definimos el costo de envío (si no quedan productos, el envío es $0)
    const envio = subtotal > 0 ? 3000 : 0;
    const total = subtotal + envio;

    // 3. Formateamos los números de vuelta a pesos chilenos ($20.000) y los mostramos en el HTML
    document.getElementById('resumen-subtotal').textContent = `$${subtotal.toLocaleString('es-CL')}`;
    document.getElementById('resumen-envio').textContent = `$${envio.toLocaleString('es-CL')}`;
    document.getElementById('resumen-total').textContent = `$${total.toLocaleString('es-CL')}`;
    }

console.log("1. El archivo carrito.js se cargó correctamente.");

document.addEventListener('DOMContentLoaded', () => {
    console.log("2. El evento DOMContentLoaded de carrito.js se ejecutó.");

    const btnPago = document.getElementById('btn-pagar');
    const mensajePago = document.getElementById('mensaje-pago');

    console.log("3. Buscando elementos en el DOM...");
    console.log("-> Botón Pago:", btnPago);
    console.log("-> Modal Pago:", mensajePago);

    if (btnPago && mensajePago) {
        console.log("4. Ambos elementos existen. Asignando evento click...");

        btnPago.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("5. ¡Clic detectado en el botón!");

            mensajePago.classList.remove('oculto');
            console.log("6. Clase 'oculto' removida. Clases actuales del modal:", mensajePago.className);

            setTimeout(() => {
                mensajePago.classList.add('oculto');
                console.log("7. Modal ocultado nuevamente.");
            }, 3500);
        });
    } else {
        console.error("ERROR: No se encontró 'btn-pagar' o 'mensaje-pago' en el DOM de esta página.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const btnPago = document.getElementById('btn-pagar');
    const mensajePago = document.getElementById('mensaje-pago');
    const modalVacio = document.getElementById('modal-carrito-vacio');
    const btnCerrarVacio = document.getElementById('btn-cerrar-vacio');
    const totalElemento = document.getElementById('resumen-total');

    if (btnPago) {
        btnPago.addEventListener('click', (e) => {
            e.preventDefault();

            // Limpiamos el texto del total para obtener solo el valor o verificar si es cero
            const textoTotal = totalElemento ? totalElemento.textContent.trim() : "$0";

            // Si el total es $0, $0.000 o está vacío
            if (textoTotal === "$0" || textoTotal === "$0.000" || textoTotal === "0") {
                if (modalVacio) modalVacio.classList.remove('oculto');
            } else {
                // Si hay un monto válido, mostramos el modal de Webpay
                if (mensajePago) {
                    mensajePago.classList.remove('oculto');
                    setTimeout(() => {
                        mensajePago.classList.add('oculto');
                    }, 3500);
                }
            }
        });
    }

    // Evento para cerrar el modal de carrito vacío
    if (btnCerrarVacio && modalVacio) {
        btnCerrarVacio.addEventListener('click', () => {
            modalVacio.classList.add('oculto');
        });
    }
});