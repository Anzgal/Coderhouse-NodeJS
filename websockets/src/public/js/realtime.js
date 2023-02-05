const socketClient = io();

const formulario = document.getElementById("formulario");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputCode = document.getElementById("code");
const inputStock = document.getElementById("stock");
const inputThumbnails = document.getElementById("thumbnails");
const inputCategory = document.getElementById("category");
const parrafoMensajes = document.getElementById("parrafoMensajes");

socketClient.on("fetchProductos", (productos) => {
  console.log("El servidor envió estos productos: ", productos);
  let infoMensaje = "";
  productos.products.forEach((element) => {
    infoMensaje += `<b>ID:</b> ${element.id} <b>Título:</b> ${element.title} <b>Descripción:</b> ${element.description} <b>Precio:</b> ${element.price} <b>Código:</b> ${element.code} <b>Stock:</b> ${element.stock} <br>`;
  });
  parrafoMensajes.innerHTML = infoMensaje;
});

formulario.onsubmit = (e) => {
  e.preventDefault();
  const title = inputTitle.value;
  const description = inputDescription.value;
  const price = inputDescription.value;
  const code = inputCode.value;
  const stock = inputStock.value;
  const thumbnails = inputThumbnails.value;
  const category = inputCategory.value;

  socketClient.emit("newProduct", {
    title,
    description,
    price,
    code,
    stock,
    thumbnails,
    category,
  });
};

socketClient.on("productAdded", (productos) => {
  console.log(
    "El servidor envió estos productos actualizados (add): ",
    productos
  );
  let infoMensaje = "";
  productos.products.forEach((element) => {
    infoMensaje += `<b>ID:</b> ${element.id} <b>Título:</b> ${element.title} <b>Descripción:</b> ${element.description} <b>Precio:</b> ${element.price} <b>Código:</b> ${element.code} <b>Stock:</b> ${element.stock} <br>`;
  });
  parrafoMensajes.innerHTML = infoMensaje;
});

socketClient.on("error", (error) => {
  console.log("ERROR", error);
  alert(error);
});
