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
    // 3. APLICAR CÓDIGO DE DESCUENTO
    // ==========================================
    const inputCupon = document.getElementById('codigo-descuento');
    const btnAplicarCupon = document.querySelector('.btn-aplicar-cupon');

    if (btnAplicarCupon && inputCupon) {
        btnAplicarCupon.addEventListener('click', () => {
            const codigoIngresado = inputCupon.value.toUpperCase().trim();
            if (!codigoIngresado) {
                alert("Por favor, ingresa un código de descuento.");
                return;
            }

            const cuponesGuardados = JSON.parse(localStorage.getItem('cuponesMangaVerse')) || [];
            const cuponEncontrado = cuponesGuardados.find(c => c.codigo === codigoIngresado);

            if (!cuponEncontrado) {
                alert("El código de descuento ingresado no existe.");
                return;
            }

            if (cuponEncontrado.estado !== "Activo") {
                alert("Este cupón se encuentra expirado o inactivo.");
                return;
            }

            const hoy = new Date().toISOString().split('T')[0];
            if (cuponEncontrado.inicio && hoy < cuponEncontrado.inicio) {
                alert(`Este cupón aún no está vigente. Comienza el ${cuponEncontrado.inicio}.`);
                return;
            }
            if (cuponEncontrado.vencimiento && hoy > cuponEncontrado.vencimiento) {
                alert("Lo sentimos, este cupón ya ha expirado.");
                return;
            }

            let descuentoVal = 0;
            let tipoVal = null;

            const textoDesc = cuponEncontrado.descuento.toLowerCase();
            if (textoDesc.includes('%')) {
                const matchPorc = textoDesc.match(/(\d+)/);
                if (matchPorc) {
                    descuentoVal = parseInt(matchPorc[0]);
                    tipoVal = 'porcentaje';
                }
            } else {
                const matchMonto = textoDesc.replace(/\./g, '').match(/(\d+)/);
                if (matchMonto) {
                    descuentoVal = parseInt(matchMonto[0]);
                    tipoVal = 'monto';
                }
            }

            const datosCupon = {
                codigo: cuponEncontrado.codigo,
                valor: descuentoVal,
                tipo: tipoVal
            };
            localStorage.setItem('cuponActivoMangaVerse', JSON.stringify(datosCupon));

            alert(`¡Cupón "${cuponEncontrado.codigo}" aplicado con éxito!`);
            if (inputCupon) inputCupon.value = cuponEncontrado.codigo;

            actualizarTotales();
        });
    }

    // ==========================================
    // 4. CONTROL DE PAGO, STOCK, PEDIDOS Y REDIRECCIÓN
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
                // A. Descontar stock en productosMangaVerse
                let productosInventario = JSON.parse(localStorage.getItem('productosMangaVerse')) || [];
                carritoActual.forEach(itemCarrito => {
                    const productoInv = productosInventario.find(p => p.titulo === itemCarrito.nombre);
                    if (productoInv) {
                        productoInv.stock -= itemCarrito.cantidad;
                        if (productoInv.stock < 0) productoInv.stock = 0;
                    }
                });
                localStorage.setItem('productosMangaVerse', JSON.stringify(productosInventario));

                // B. Calcular totales finales para el registro
                let subtotal = carritoActual.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
                let envio = subtotal > 0 ? 3000 : 0;
                let total = subtotal + envio;
                let montoDescuento = 0;

                const cuponActivo = JSON.parse(localStorage.getItem('cuponActivoMangaVerse'));
                if (cuponActivo && cuponActivo.valor > 0) {
                    if (cuponActivo.tipo === 'porcentaje') {
                        montoDescuento = subtotal * (cuponActivo.valor / 100);
                        total -= montoDescuento;
                    } else if (cuponActivo.tipo === 'monto') {
                        montoDescuento = cuponActivo.valor;
                        total -= montoDescuento;
                    }
                }
                if (total < 0) total = 0;

                // C. Registrar el pedido en pedidosMangaVerse con ID Autoincremental
                const usuarioActivo = localStorage.getItem('usuarioMangaVerse') || 'Invitado';
                let pedidosGuardados = JSON.parse(localStorage.getItem('pedidosMangaVerse')) || [];
                
                // ID Autoincremental (empezando desde 0 y aumentando de 1 en 1)
                const siguienteId = pedidosGuardados.length;
                const idPedidoFormateado = `#${siguienteId}`;

                const nuevoPedido = {
                    id: idPedidoFormateado,
                    usuario: usuarioActivo,
                    productos: carritoActual,
                    subtotal: subtotal,
                    envio: envio,
                    descuento: Math.round(montoDescuento),
                    total: Math.round(total),
                    fecha: new Date().toLocaleDateString('es-CL'),
                    estado: "Completado"
                };

                pedidosGuardados.push(nuevoPedido);
                localStorage.setItem('pedidosMangaVerse', JSON.stringify(pedidosGuardados));

                // D. Mostrar modal de éxito y limpiar carrito/cupón
                if (mensajePago) {
                    const contenidoModal = mensajePago.querySelector('.modal-contenido');
                    if (contenidoModal) {
                        contenidoModal.innerHTML = `
                            <h3>¡Pago realizado con éxito!</h3>
                            <p>Stock actualizado y pedido registrado. Redirigiendo...</p>
                        `;
                    }

                    mensajePago.classList.remove('oculto');

                    localStorage.removeItem('carritoMangaVerse'); 
                    localStorage.removeItem('cuponActivoMangaVerse'); 

                    setTimeout(() => {
                        window.location.href = 'compra-exitosa.html';
                    }, 2000);
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

    const cuponGuardado = JSON.parse(localStorage.getItem('cuponActivoMangaVerse'));
    const inputCupon = document.getElementById('codigo-descuento');
    if (cuponGuardado && inputCupon && !inputCupon.value) {
        inputCupon.value = cuponGuardado.codigo;
    }

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

    let carritoActual = JSON.parse(localStorage.getItem('carritoMangaVerse')) || [];

    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            carritoActual[index].cantidad += 1;
            localStorage.setItem('carritoMangaVerse', JSON.stringify(carritoActual));
            renderizarTablaCarrito();
        });
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (carritoActual[index].cantidad > 1) {
                carritoActual[index].cantidad -= 1;
            } else {
                carritoActual.splice(index, 1);
            }
            localStorage.setItem('carritoMangaVerse', JSON.stringify(carritoActual));
            renderizarTablaCarrito();
        });
    });

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
// FUNCIÓN DE CÁLCULO DE TOTALES Y DESCUENTO
// ==========================================
function actualizarTotales() {
    let subtotal = 0;

    const filasRestantes = document.querySelectorAll('.tabla-carrito tbody tr');
    filasRestantes.forEach(fila => {
        if (fila.querySelector('.btn-eliminar')) {
            const celdaPrecio = fila.children[2] ? fila.children[2].textContent : "$0";
            const precioNumero = parseInt(celdaPrecio.replace('$', '').replace(/\./g, '')) || 0;
            subtotal += precioNumero;
        }
    });

    const envio = subtotal > 0 ? 3000 : 0;
    let total = subtotal + envio;
    let montoDescuento = 0;

    const cuponActivo = JSON.parse(localStorage.getItem('cuponActivoMangaVerse'));

    if (cuponActivo && cuponActivo.valor > 0) {
        if (cuponActivo.tipo === 'porcentaje') {
            montoDescuento = subtotal * (cuponActivo.valor / 100);
            total -= montoDescuento;
        } else if (cuponActivo.tipo === 'monto') {
            montoDescuento = cuponActivo.valor;
            total -= montoDescuento;
        }
    }

    if (total < 0) total = 0;

    const subtotalEl = document.getElementById('resumen-subtotal');
    const envioEl = document.getElementById('resumen-envio');
    const descuentoEl = document.getElementById('resumen-descuento');
    const totalEl = document.getElementById('resumen-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    if (envioEl) envioEl.textContent = `$${envio.toLocaleString('es-CL')}`;
    if (descuentoEl) descuentoEl.textContent = `-$${Math.round(montoDescuento).toLocaleString('es-CL')}`;
    if (totalEl) totalEl.textContent = `$${Math.round(total).toLocaleString('es-CL')}`;
}

// ==========================================
// FUNCIÓN PARA TOAST NOTIFICATION
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