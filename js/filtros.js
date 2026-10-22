document.addEventListener('DOMContentLoaded', () => {
    const cboGenero = document.getElementById('cboGenero');
    const cboEditorial = document.getElementById('cboEditorial');
    const cboPrecio = document.getElementById('cboPrecio');
    const cboAutor = document.getElementById('cboAutor');

    const tarjetasManga = document.querySelectorAll('.card-manga');

    function aplicarFiltros() {
        const generoSeleccionado = cboGenero.value;
        const editorialSeleccionada = cboEditorial.value;
        const precioSeleccionado = cboPrecio.value;
        const autorSeleccionado = cboAutor.value;

        tarjetasManga.forEach(tarjeta => {
            const generoCard = tarjeta.getAttribute('data-genero');
            const editorialCard = tarjeta.getAttribute('data-editorial');
            const precioCard = parseInt(tarjeta.getAttribute('data-precio'));
            const autorCard = tarjeta.getAttribute('data-autor');

            let coincide = true;

            // Filtro de Género
            if (generoSeleccionado && generoCard !== generoSeleccionado) {
                coincide = false;
            }

            // Filtro de Editorial
            if (editorialSeleccionada && editorialCard !== editorialSeleccionada) {
                coincide = false;
            }

            // Filtro de Autor
            if (autorSeleccionado && autorCard !== autorSeleccionado) {
                coincide = false;
            }

            // Filtro de Rango de Precio
            if (precioSeleccionado) {
                if (precioSeleccionado === "100000+") {
                    if (precioCard < 100000) coincide = false;
                } else {
                    const [min, max] = precioSeleccionado.split('-').map(Number);
                    if (precioCard < min || precioCard > max) {
                        coincide = false;
                    }
                }
            }

            // Mostrar u ocultar la tarjeta según los filtros
            if (coincide) {
                tarjeta.style.display = "block";
            } else {
                tarjeta.style.display = "none";
            }
        });
    }

    // Escuchar cambios en cualquiera de los selects
    if (cboGenero) cboGenero.addEventListener('change', aplicarFiltros);
    if (cboEditorial) cboEditorial.addEventListener('change', aplicarFiltros);
    if (cboPrecio) cboPrecio.addEventListener('change', aplicarFiltros);
    if (cboAutor) cboAutor.addEventListener('change', aplicarFiltros);
});