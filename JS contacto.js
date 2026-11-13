

const heading = document.querySelector('h2');
heading.textContent = "Contactanos";
heading.classList.add('nueva-clase');
console.log(heading);

// querySelectorAll
const enlaces = document.querySelectorAll('.nav-principal a');
console.log(enlaces);

enlaces[0].textContent = 'Sobre Nosotros';
enlaces[0].href = 'Sobre_N.html';

// getElementById
const heading2 = document.querySelector('h2');
console.log(heading2);

// generar nuevo enlace
const nuevoEnlace = document.createElement('A');
nuevoEnlace.href = "Cotizacion.html";
nuevoEnlace.textContent = "Cotizaciones";
nuevoEnlace.classList.add("navegacion__enlace");

const navegacion = document.querySelector(".nav-principal");
// navegacion.appendChild(nuevoEnlace);

// Eventos
console.log(1);

window.addEventListener('load', function(){
    console.log(2);
});

window.onload = function(){
    console.log(3);
};

document.addEventListener('DOMContentLoaded', function(){
    console.log(4);
});

console.log(5);

window.onscroll = function(){
    console.log('scrolling...');
};

// Eventos con teclado
const nombre = document.querySelector('#nombre');
const telefono = document.querySelector('#telefono');
const email = document.querySelector('#email');
const mensaje = document.querySelector('#mensaje');

nombre.addEventListener('input', leerTexto);
telefono.addEventListener('input', leerTexto);
email.addEventListener('input', leerTexto);
mensaje.addEventListener('input', leerTexto);

// Eventos de los inputs y textareas
const datos = {
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
};

function leerTexto(e){
    datos[e.target.id] = e.target.value;
    console.log(datos);
}

// Evento del submit (enviar)
const formulario = document.querySelector('.formulario');

formulario.addEventListener('submit', function(evento){
    evento.preventDefault();

    const {nombre, telefono, email, mensaje} = datos;

    if(nombre == '' || telefono == '' || email == '' || mensaje == ''){
        mostrarError('Todos los campos son obligatorios!!');
        return;
    }

    mostrarMensaje('Formulario enviado correctamente');
});

function mostrarError(mensaje){
    const error = document.createElement('P');
    error.textContent = mensaje;
    error.classList.add('error');
    formulario.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 3000);
}

function mostrarMensaje(mensaje){
    const alerta = document.createElement('P');
    alerta.textContent = mensaje;
    alerta.classList.add('correcto');
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}
