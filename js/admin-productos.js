document.addEventListener('DOMContentLoaded', function() {
    const tbodyProductos = document.getElementById('tabla-productos-body');
    const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
    const modalProducto = document.getElementById('modal-producto');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const formProducto = document.getElementById('form-producto');
    const modalTitulo = document.getElementById('modal-titulo');
    
    const inputIndex = document.getElementById('producto-index');
    const inputTitulo = document.getElementById('input-titulo');
    const inputPrecio = document.getElementById('input-precio');
    const inputStock = document.getElementById('input-stock');
    const inputImagen = document.getElementById('input-imagen');

    if (!tbodyProductos) return;

    function obtenerProductos() {
        let productos = JSON.parse(localStorage.getItem('productosMangaVerse'));
        if (!productos) {
            productos = productosIniciales;
            localStorage.setItem('productosMangaVerse', JSON.stringify(productos));
        }
        return productos;
    }

    function guardarProductos(productos) {
        localStorage.setItem('productosMangaVerse', JSON.stringify(productos));
    }

    function cargarProductos() {
        const productos = obtenerProductos();
        tbodyProductos.innerHTML = "";

        if (productos.length === 0) {
            tbodyProductos.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No hay mangas en el inventario.</td></tr>`;
            return;
        }

        productos.forEach((prod, index) => {
            const tr = document.createElement('tr');
            
            // Formatear precio en pesos chilenos de forma limpia
            const precioFormateado = Number(prod.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

            tr.innerHTML = `
                <td><img src="${prod.imagen}" alt="Manga" style="width: 40px; height: 55px; object-fit: cover; border-radius: 4px;" onerror="this.src='img/Logo2.png'"></td>
                <td><strong>${prod.titulo}</strong></td>
                <td>${precioFormateado}</td>
                <td>${prod.stock}</td>
                <td>
                    <button type="button" class="btn-accion editar btn-editar" data-index="${index}">Editar</button>
                    <button type="button" class="btn-accion eliminar btn-eliminar" data-index="${index}">Eliminar</button>
                </td>
            `;

            tbodyProductos.appendChild(tr);
        });

        // Eventos para Editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                const productos = obtenerProductos();
                const prod = productos[idx];

                inputIndex.value = idx;
                inputTitulo.value = prod.titulo;
                inputPrecio.value = prod.precio;
                inputStock.value = prod.stock;
                inputImagen.value = prod.imagen;

                modalTitulo.textContent = "Editar Manga";
                modalProducto.style.display = 'flex';
            });
        });

        // Eventos para Eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                let productos = obtenerProductos();
                
                if (confirm(`¿Estás seguro de eliminar el tomo "${productos[idx].titulo}"?`)) {
                    productos.splice(idx, 1);
                    guardarProductos(productos);
                    cargarProductos();
                }
            });
        });
    }

    // Abrir modal para crear nuevo
    if (btnNuevoProducto && modalProducto) {
        btnNuevoProducto.addEventListener('click', function(e) {
            e.preventDefault();
            formProducto.reset();
            inputIndex.value = ""; // Vacío significa que es nuevo
            modalTitulo.textContent = "Agregar Nuevo Manga";
            modalProducto.style.display = 'flex';
        });
    }

    // Cerrar modal con botón cancelar
    if (btnCancelarModal && modalProducto) {
        btnCancelarModal.addEventListener('click', function() {
            modalProducto.style.display = 'none';
            formProducto.reset();
        });
    }

    // Guardar (Crear o Actualizar) desde el formulario
    if (formProducto && modalProducto) {
        formProducto.addEventListener('submit', function(e) {
            e.preventDefault();

            const idx = inputIndex.value;
            const titulo = inputTitulo.value.trim();
            const precio = Number(inputPrecio.value);
            const stock = Number(inputStock.value);
            const imagen = inputImagen.value.trim();

            let productos = obtenerProductos();

            if (idx === "") {
                // Crear nuevo producto
                productos.push({ titulo, precio, stock, imagen });
            } else {
                // Actualizar producto existente
                productos[idx] = { titulo, precio, stock, imagen };
            }

            guardarProductos(productos);
            cargarProductos();

            modalProducto.style.display = 'none';
            formProducto.reset();
        });
    }

    // Cargar inventario al iniciar
    cargarProductos();
});