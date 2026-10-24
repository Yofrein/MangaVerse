document.addEventListener('DOMContentLoaded', function() {
    const tbodyPedidos = document.querySelector('.tabla-admin-inventario tbody');

    if (!tbodyPedidos) return;

    function cargarPedidosRecientes() {
        // Obtenemos los pedidos guardados al realizar compras en el carrito
        const pedidos = JSON.parse(localStorage.getItem('pedidosMangaVerse')) || [];
        
        tbodyPedidos.innerHTML = "";

        if (pedidos.length === 0) {
            tbodyPedidos.innerHTML = `<tr><td colspan="5" class="tabla-vacia">No hay pedidos recientes registrados.</td></tr>`;
            return;
        }

        // Recorremos los pedidos (mostrando los más recientes primero)
        pedidos.slice().reverse().forEach(pedido => {
            const tr = document.createElement('tr');

            // Formatear el total pagado en pesos chilenos
            const totalFormateado = Number(pedido.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

            // Región de despacho (por defecto o la seleccionada)
            const regionDespacho = pedido.region || "Región Metropolitana de Santiago";
            const estadoActual = pedido.estado || 'Completado';

            tr.innerHTML = `
                <td><strong>${pedido.id}</strong></td>
                <td>${pedido.usuario}</td>
                <td>${regionDespacho}</td>
                <td>${totalFormateado}</td>
                <td><span class="estado-pedido-completado">${estadoActual}</span></td>
            `;

            tbodyPedidos.appendChild(tr);
        });
    }

    // Cargar los pedidos al iniciar la página
    cargarPedidosRecientes();
});