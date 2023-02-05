const socketClient = io();


socketClient.on("fetchProductos", (productos) => {
  console.log("El servidor envió estos productos: ", productos);
  let infoMensaje = "";
  productos.products.forEach((element) => {
    infoMensaje += `<b>ID:</b> ${element.id} <b>Título:</b> ${element.title} <b>Descripción:</b> ${element.description} <b>Precio:</b> ${element.price} <b>Código:</b> ${element.code} <b>Stock:</b> ${element.stock} <br>`;
  });
  parrafoMensajes.innerHTML = infoMensaje;
});

