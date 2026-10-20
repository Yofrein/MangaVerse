document.addEventListener('DOMContentLoaded', () => {
    const pista = document.getElementById('carrusel-pista');
    const btnPrev = document.getElementById('carrusel-prev');
    const btnNext = document.getElementById('carrusel-next');

    if (pista && btnPrev && btnNext) {
        // Evento para el botón Siguiente (Derecha)
        btnNext.addEventListener('click', () => {
            const tarjeta = pista.querySelector('.recuadro-mangas');
            const tarjetaWidth = tarjeta.getBoundingClientRect().width + 20; // Ancho + el gap de 20px
            
            // Usamos un margen de tolerancia mayor (- 50px) para evitar fallos de decimales
            if (Math.ceil(pista.scrollLeft + pista.clientWidth) >= pista.scrollWidth - 50) {
                pista.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                pista.scrollBy({ left: tarjetaWidth, behavior: 'smooth' });
            }
        });

        // Evento para el botón Anterior (Izquierda)
        btnPrev.addEventListener('click', () => {
            const tarjeta = pista.querySelector('.recuadro-mangas');
            const tarjetaWidth = tarjeta.getBoundingClientRect().width + 20;
            
            // Si está al principio, salta al final
            if (pista.scrollLeft <= 30) {
                pista.scrollTo({ left: pista.scrollWidth, behavior: 'smooth' });
            } else {
                pista.scrollBy({ left: -tarjetaWidth, behavior: 'smooth' });
            }
        });
    }
});