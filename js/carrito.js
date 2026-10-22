console.log("1. El archivo carrito.js se cargó correctamente.");

// Variable global para controlar el temporizador del Toast
let temporizadorToast = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("2. El evento DOMContentLoaded se ejecutó.");

    // ==========================================
    // 1. CAPTURAR CLICS DESDE INDEX Y CATÁLOGO
    // ==========================================
    const botonesAgregar = document.querySelectorAll('.anadir-carrito, .anadir-carrito-chico');

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const card = e.target.closest('.card-manga, .recuadro-mangas, .recuadro-mangas-masvendidos');
            
            if (card) {
                const tituloEl = card.querySelector('h1, h3');
                const precioEl = card.querySelector('h2, .precio');
                const imagenEl = card.querySelector('img');

                if (tituloEl && precioEl && imagenEl) {
                    const nombre = tituloEl.textContent.trim();
                    const precioTexto = precioEl.textContent.trim();
                    const precio = parseInt(precioTexto.replace(/[^0-9]/g, '')) || 0;
                    const imagen = imagenEl.getAttribute('src');

                    let carrito = JSON.parse(localStorage.getItem('carritoMangaVerse')) || [];

                    let existe = carrito.find(item => item.nombre === nombre);
                    if (existe) {
                        existe.cantidad += 1;
                    } else {
                        carrito.push({ nombre, precio, imagen, cantidad: 1 });
                    }

                    localStorage.setItem('carritoMangaVerse', JSON.stringify(carrito));
                    mostrarNotificacion(nombre);
                } else {
                    console.error("Faltan elementos (título, precio o imagen) en esta tarjeta.");
                }
            }
        });
    });

    // ==========================================
    // 2. RENDERIZAR EN CARRITO.HTML
    // ==========================================
    const tablaCuerpo = document.getElementById('tabla-carrito-cuerpo');
    
    if (tablaCuerpo) {
        renderizarTablaCarrito();
    }

    // ==========================================
    // 3. CONTROL DE MODALES DE PAGO
    // ==========================================
    const btnPago = document.getElementById('btn-pagar');
    const mensajePago = document.getElementById('mensaje-pago');
    const modalVacio = document.getElementById('modal-carrito-vacio');
    const btnCerrarVacio = document.getElementById('btn-cerrar-vacio');

    if (btnPago) {
        btnPago.addEventListener('click', (e) => {
            e.preventDefault();

            let carritoActual = JSON.parse(localStorage.getItem('carritoMangaVerse')) || [];
            
            if (carritoActual.length === 0) {
                if (modalVacio) modalVacio.classList.remove('oculto');
            } else {
                if (mensajePago) {
                    mensajePago.classList.remove('oculto');

                    setTimeout(() => {
                        mensajePago.classList.add('oculto');
                        localStorage.removeItem('carritoMangaVerse'); 
                        renderizarTablaCarrito(); 
                    }, 3500);
                }
            }
        });
    }

    if (btnCerrarVacio && modalVacio) {
        btnCerrarVacio.addEventListener('click', () => {
            modalVacio.classList.add('oculto');
        });
    }
});

// ==========================================
// FUNCIÓN PARA PINTAR LA TABLA DINÁMICAMENTE
// ==========================================
function renderizarTablaCarrito() {
    const tablaCuerpo = document.getElementById('tabla-carrito-cuerpo');
    if (!tablaCuerpo) return;

    let carrito = JSON.parse(localStorage.getItem('carritoMangaVerse')) || [];
    tablaCuerpo.innerHTML = '';

    if (carrito.length === 0) {
        tablaCuerpo.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 25px; color: #444;">Tu carrito está vacío.</td></tr>`;
        actualizarTotales();
        return;
    }

    carrito.forEach((producto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <div class="producto-info">
                    <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 75px; object-fit: cover;">
                    <span>${producto.nombre}</span>
                </div>
            </td>
            <td>
                <div class="control-cantidad" style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn-restar" data-index="${index}" style="padding: 2px 8px; cursor: pointer; font-weight: bold;">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="btn-sumar" data-index="${index}" style="padding: 2px 8px; cursor: pointer; font-weight: bold;">+</button>
                </div>
            </td>
            <td>$${(producto.precio * producto.cantidad).toLocaleString('es-CL')}</td>
            <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
        `;
        tablaCuerpo.appendChild(fila);
    });

    actualizarTotales();

    // ==========================================
    // EVENTOS DE BOTONES: SUMAR, RESTAR Y ELIMINAR
    // ==========================================
    let carritoActual = JSON.parse(localStorage.getItem('carritoMangaVerse')) || [];

    // Botones sumar (+)
    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            carritoActual[index].cantidad += 1;
            localStorage.setItem('carritoMangaVerse', JSON.stringify(carritoActual));
            renderizarTablaCarrito();
        });
    });

    // Botones restar (-)
    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (carritoActual[index].cantidad > 1) {
                carritoActual[index].cantidad -= 1;
            } else {
                // Si llega a 1 y presiona restar, podemos eliminar el producto o dejarlo en 1. 
                // Aquí lo eliminamos si baja de 1, o puedes omitir el splice si prefieres que el mínimo sea 1.
                carritoActual.splice(index, 1);
            }
            localStorage.setItem('carritoMangaVerse', JSON.stringify(carritoActual));
            renderizarTablaCarrito();
        });
    });

    // Botones eliminar fila completa
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            carritoActual.splice(index, 1);
            localStorage.setItem('carritoMangaVerse', JSON.stringify(carritoActual));
            renderizarTablaCarrito();
        });
    });
}

// ==========================================
// FUNCIÓN DE CÁLCULO DE TOTALES
// ==========================================
function actualizarTotales() {
    let subtotal = 0;

    const filasRestantes = document.querySelectorAll('.tabla-carrito tbody tr');
    filasRestantes.forEach(fila => {
        // Ignoramos la fila de "carrito vacío" si existe
        if (fila.querySelector('.btn-eliminar')) {
            const celdaPrecio = fila.children[2] ? fila.children[2].textContent : "$0";
            const precioNumero = parseInt(celdaPrecio.replace('$', '').replace(/\./g, '')) || 0;
            subtotal += precioNumero;
        }
    });

    const envio = subtotal > 0 ? 3000 : 0;
    const total = subtotal + envio;

    const subtotalEl = document.getElementById('resumen-subtotal');
    const envioEl = document.getElementById('resumen-envio');
    const totalEl = document.getElementById('resumen-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    if (envioEl) envioEl.textContent = `$${envio.toLocaleString('es-CL')}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
}

// ==========================================
// FUNCIÓN PARA MOSTRAR TU TOAST NOTIFICATION
// ==========================================
function mostrarNotificacion(nombreProducto) {
    const toast = document.getElementById('toast-notificacion');
    const nombreSpan = document.getElementById('toast-producto-nombre');
    
    if (toast && nombreSpan) {
        if (temporizadorToast) {
            clearTimeout(temporizadorToast);
        }

        nombreSpan.textContent = nombreProducto;
        toast.classList.add('mostrar');

        temporizadorToast = setTimeout(() => {
            toast.classList.remove('mostrar');
            temporizadorToast = null;
        }, 3000);
    }
}