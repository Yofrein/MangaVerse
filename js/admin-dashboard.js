document.addEventListener('DOMContentLoaded', function() {
    // 1. Cargar y calcular métricas del Dashboard
    cargarMetricasDashboard();

    // 2. Cargar inventario rápido en la tabla
    cargarInventarioRapido();
});

function cargarMetricasDashboard() {
    // Obtener datos reales desde el localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidosMangaVerse')) || [];
    const productos = JSON.parse(localStorage.getItem('productosMangaVerse')) || [];

    // Calcular Ventas Totales acumuladas
    const ventasTotales = pedidos.reduce((acc, pedido) => acc + (pedido.total || 0), 0);

    // Contar pedidos pendientes o completados
    const pedidosPendientes = pedidos.filter(p => !p.estado || p.estado === "Pendiente" || p.estado === "Preparando").length;

    // Calcular el stock total sumando la cantidad de todos los mangas
    const stockTotal = productos.reduce((acc, prod) => acc + (parseInt(prod.stock) || 0), 0);

    // Seleccionar los elementos de las tarjetas en el HTML
    const contenedorMetricas = document.querySelectorAll('.valor-metrica');
    
    if (contenedorMetricas.length >= 3) {
        contenedorMetricas[0].textContent = ventasTotales.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
        contenedorMetricas[1].textContent = pedidosPendientes;
        contenedorMetricas[2].textContent = stockTotal;
    }
}

function cargarInventarioRapido() {
    const tbodyInventario = document.querySelector('.tabla-admin-inventario tbody');
    if (!tbodyInventario) return;

    // Obtener productos desde el almacenamiento (clave común de la gestión de inventario)
    const productos = JSON.parse(localStorage.getItem('productosMangaVerse')) || [];

    tbodyInventario.innerHTML = "";

    if (productos.length === 0) {
        tbodyInventario.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No hay productos registrados en el inventario.</td></tr>`;
        return;
    }

    // Mostrar un resumen rápido (por ejemplo, los primeros 5 productos)
    productos.slice(0, 5).forEach(prod => {
        const tr = document.createElement('tr');

        const precioFormateado = Number(prod.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
        const imagenSrc = prod.imagen || prod.imagenUrl || 'img/Logo2.png';

        tr.innerHTML = `
            <td><img src="${imagenSrc}" alt="${prod.titulo}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 4px;" onerror="this.src='img/Logo2.png'"></td>
            <td>${prod.titulo}</td>
            <td>${precioFormateado}</td>
            <td>${prod.stock}</td>
            <td>
                <a href="admin-productos.html" class="btn-accion editar" style="text-decoration: none; display: inline-block; text-align: center;">Gestionar</a>
            </td>
        `;

        tbodyInventario.appendChild(tr);
    });
}