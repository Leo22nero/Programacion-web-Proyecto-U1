const imagenes = document.querySelectorAll('.slider img');

let indice = 0;

function cambiarImagen() {

    imagenes[indice].classList.remove('activa');

    indice++;

    if (indice >= imagenes.length) {
        indice = 0;
    }

    imagenes[indice].classList.add('activa');
}

setInterval(cambiarImagen, 5000);