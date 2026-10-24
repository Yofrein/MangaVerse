document.addEventListener('DOMContentLoaded', () => {
    // Obtener los pedidos guardados en el localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidosMangaVerse')) || [];
    
    if (pedidos.length > 0) {
        // Tomamos el último pedido realizado
        const ultimoPedido = pedidos[pedidos.length - 1];

        // Llenar los datos de texto en el HTML
        const elementoCodigo = document.getElementById('detalle-codigo');
        const elementoFecha = document.getElementById('detalle-fecha');
        const elementoTotal = document.getElementById('detalle-total');

        if (elementoCodigo) elementoCodigo.textContent = ultimoPedido.id;
        if (elementoFecha) elementoFecha.textContent = ultimoPedido.fecha;
        if (elementoTotal) elementoTotal.textContent = `$${ultimoPedido.total.toLocaleString('es-CL')}`;

        // Renderizar las miniaturas de los productos con su respectiva burbuja de cantidad
        const contenedorMiniaturas = document.getElementById('exito-productos-container');
        if (contenedorMiniaturas) {
            contenedorMiniaturas.innerHTML = '';

            ultimoPedido.productos.forEach(prod => {
                const div = document.createElement('div');
                div.className = 'exito-item-miniatura';
                
                // Aseguramos compatibilidad con los nombres de las propiedades del carrito
                const imagenProd = prod.imagen || prod.imagenUrl;
                const nombreProd = prod.nombre || prod.titulo;

                div.innerHTML = `
                    <img src="${imagenProd}" alt="${nombreProd}" onerror="this.src='img/Logo2.png'">
                    <span class="exito-badge-cantidad">${prod.cantidad}</span>
                `;
                contenedorMiniaturas.appendChild(div);
            });
        }
    }
});