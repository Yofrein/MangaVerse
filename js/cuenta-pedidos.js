document.addEventListener('DOMContentLoaded', function() {
    const tbodyPedidosCliente = document.querySelector('.tabla-cuenta tbody');

    if (!tbodyPedidosCliente) return;

    function cargarPedidosCliente() {
        // 1. Obtener el usuario activo actual
        // (Dependiendo de cómo guardes la sesión, puede ser 'usuarioMangaVerse' o desde 'cuentaRegistrada')
        const usuarioActivo = localStorage.getItem('usuarioMangaVerse') || JSON.parse(localStorage.getItem('cuentaRegistrada'))?.usuario;

        const todosLosPedidos = JSON.parse(localStorage.getItem('pedidosMangaVerse')) || [];
        
        tbodyPedidosCliente.innerHTML = "";

        // Si no hay sesión iniciada o no hay pedidos en general
        if (!usuarioActivo || todosLosPedidos.length === 0) {
            tbodyPedidosCliente.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 25px; color: #666;">No tienes pedidos registrados en tu historial.</td></tr>`;
            return;
        }

        // 2. Filtrar los pedidos que coincidan con el usuario actual (o mostrar todos si se guardó como 'Invitado')
        const misPedidos = todosLosPedidos.filter(p => p.usuario === usuarioActivo || p.usuario === 'Invitado');

        if (misPedidos.length === 0) {
            tbodyPedidosCliente.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 25px; color: #666;">Aún no has realizado ninguna compra.</td></tr>`;
            return;
        }

        // 3. Renderizar los pedidos en la tabla (ordenados del más reciente al más antiguo)
        misPedidos.slice().reverse().forEach(pedido => {
            const tr = document.createElement('tr');

            // Formatear los nombres de los productos comprados en una sola cadena legible
            const listaProductos = pedido.productos.map(prod => `${prod.nombre || prod.titulo} (${prod.cantidad})`).join(', ');

            // Formatear el total pagado en pesos chilenos
            const totalFormateado = Number(pedido.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

            const estado = pedido.estado || 'Completado';

            tr.innerHTML = `
                <td><strong>${pedido.id}</strong></td>
                <td>${pedido.fecha}</td>
                <td>${listaProductos}</td>
                <td>${totalFormateado}</td>
                <td><span class="estado-pedido estado-entregado">${estado}</span></td>
            `;

            tbodyPedidosCliente.appendChild(tr);
        });
    }

    cargarPedidosCliente();
});