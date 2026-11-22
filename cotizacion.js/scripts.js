
// ========================================
// 1. OBTENER LOS ELEMENTOS DEL HTML
// ========================================

// Botones de los paquetes
const botones = document.querySelectorAll(".btn-cotizar");

// Elementos del formulario
const formulario = document.getElementById("formCotizacion");

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const tipoFoto = document.getElementById("tipoFoto");
const fecha = document.getElementById("fecha");
const paqueteSeleccionado = document.getElementById("paqueteSeleccionado");
const fotosExtra = document.getElementById("fotosExtra");
const comentarios = document.getElementById("comentarios");

// Elementos del resumen
const resumenPaquete = document.getElementById("resumenPaquete");
const precioPaquete = document.getElementById("precioPaquete");
const precioExtra = document.getElementById("precioExtra");
const total = document.getElementById("total");

const mensaje = document.getElementById("mensaje");

// ========================================
// 2. CONFIGURAR LOS PRECIOS
// ========================================

const precios = {
    "Básico": 150,
    "Estándar": 250,
    "Premium": 450
};

const precioFotografiasExtra = 100;

// ========================================
// 3. FORMATEAR LOS PRECIOS
// ========================================

function formatoPrecio(cantidad) {
    return cantidad.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// ========================================
// 4. SELECCIONAR UN PAQUETE
// ========================================

botones.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const paquete = this.dataset.paquete;

        // Seleccionar el paquete en el formulario
        paqueteSeleccionado.value = paquete;

        // Actualizar los precios
        calcularCotizacion();

        // Llevar al cliente al formulario
        document.getElementById("contacto").scrollIntoView({
            behavior: "smooth"
        });

    });

});

// También permitir seleccionar desde el formulario
paqueteSeleccionado.addEventListener("change", calcularCotizacion);

// ========================================
// 5. CALCULAR LA COTIZACIÓN
// ========================================

function calcularCotizacion() {

    // Obtener el paquete seleccionado
    const paquete = paqueteSeleccionado.value;

    // Buscar el precio del paquete
    const precio = precios[paquete] || 0;

    // Comprobar si agregó fotografías extra
    const extra = fotosExtra.checked
        ? precioFotografiasExtra
        : 0;

    // Calcular el total
    const resultado = precio + extra;

    // Mostrar los resultados
    resumenPaquete.textContent = paquete || "No seleccionado";

    precioPaquete.textContent = formatoPrecio(precio);

    precioExtra.textContent = formatoPrecio(extra);

    total.textContent = formatoPrecio(resultado);

}

// Actualizar el cálculo cuando cambie el servicio adicional
fotosExtra.addEventListener("change", calcularCotizacion);

// ========================================
// 6. VALIDAR LOS DATOS DEL CLIENTE
// ========================================

function validarFormulario() {

    if (nombre.value.trim() === "") {
        alert("Por favor, escribe tu nombre.");
        nombre.focus();
        return false;
    }

    if (correo.value.trim() === "") {
        alert("Por favor, escribe tu correo electrónico.");
        correo.focus();
        return false;
    }

    if (tipoFoto.value === "") {
        alert("Selecciona el tipo de fotografía.");
        tipoFoto.focus();
        return false;
    }

    if (fecha.value === "") {
        alert("Selecciona la fecha de tu sesión.");
        fecha.focus();
        return false;
    }

    if (paqueteSeleccionado.value === "") {
        alert("Selecciona un paquete fotográfico.");
        paqueteSeleccionado.focus();
        return false;
    }

    return true;
}

// ========================================
// 7. ENVIAR LA SOLICITUD
// ========================================

formulario.addEventListener("submit", function(event) {

    // Evitar que la página se recargue
    event.preventDefault();

    // Comprobar que los datos sean correctos
    if (!validarFormulario()) {
        return;
    }

    // Obtener los datos del cliente
    const cliente = nombre.value.trim();
    const email = correo.value.trim();
    const tipo = tipoFoto.value;
    const dia = fecha.value;
    const paquete = paqueteSeleccionado.value;
    const comentariosCliente = comentarios.value.trim();

    // Calcular el precio final
    const precio = precios[paquete];

    const extra = fotosExtra.checked
        ? precioFotografiasExtra
        : 0;

    const totalFinal = precio + extra;

    // Crear el contenido del correo
    const asunto = encodeURIComponent(
        "Nueva solicitud de cotización fotográfica"
    );

    const cuerpo = encodeURIComponent(
        "SOLICITUD DE COTIZACIÓN\n\n" +
        "Nombre: " + cliente + "\n" +
        "Correo: " + email + "\n" +
        "Tipo de fotografía: " + tipo + "\n" +
        "Fecha de sesión: " + dia + "\n" +
        "Paquete: " + paquete + "\n" +
        "Precio del paquete: " + formatoPrecio(precio) + "\n" +
        "Servicios adicionales: " + formatoPrecio(extra) + "\n" +
        "Total estimado: " + formatoPrecio(totalFinal) + "\n\n" +
        "Detalles: " + comentariosCliente
    );

    // Dirección de correo del fotógrafo
    const destinatario = "jafetzetina0@gmail.com";

    // Preparar el correo electrónico
    const enlace =
        "mailto:" + destinatario +
        "?subject=" + asunto +
        "&body=" + cuerpo;

    // Mostrar confirmación
    mensaje.textContent =
        "Tu solicitud está preparada. Se abrirá tu aplicación de correo.";

    mensaje.style.color = "#55845c";

    // Abrir el programa de correo
    window.location.href = enlace;

});
