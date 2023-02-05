const socketClient = io();

socketClient.on("saludo", (mensaje) => {
  console.log("El servidor envió este mensaje: ", mensaje);
  socketClient.emit("respuestaSaludo", "Muchas gracias");
});

const formulario = document.getElementById("formulario");
const inputNombre = document.getElementById("nombre");
const inputMensaje = document.getElementById("mensaje");
const parrafoMensajes = document.getElementById("parrafoMensajes");

formulario.onsubmit = (e) => {
  e.preventDefault();
  const nombre = inputNombre.value;
  const mensaje = inputMensaje.value;
  socketClient.emit("mensaje", { nombre, mensaje });
};

socketClient.on("respuestaMensaje", (mensajes) => {
  let infoMensaje = "";
  mensajes.forEach((element) => {
    infoMensaje += `El usuario ${element.nombre} dice ${element.mensaje} <br>`;
  });
  parrafoMensajes.innerHTML = infoMensaje;
});
