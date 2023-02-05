import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";

import productsRoute from "../routes/products.router.js";
import cartsRoute from "../routes/carts.router.js";

const app = express();

//Static files in /public
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

app.get("/", (req, res) => {
  res.render("websocket");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/realtime", (req, res) => {
  res.render("realTimeProducts");
});

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

const httpServer = app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});

const socketServer = new Server(httpServer);
/*
const mensajes = [];


socketServer.on("connection", (socket) => {
  console.log("Usuario conectado: " + socket.id);
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
  socket.emit("saludo", "Bienvenido a Websocket");
  socket.on("respuestaSaludo", (mensaje) => {
    console.log("Respuesta mensaje: ", mensaje);
  });
  socket.on("mensaje", (obj) => {
    mensajes.push(obj);
    socketServer.emit("respuestaMensaje", mensajes);
  });
});
*/
socketServer.on("connection", async (socket) => {
  console.log("Usuario conectado: " + socket.id);
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
  /* 
  const productsFetch = await fetch("http://localhost:8080/api/products");
  const productsJSON = await productsFetch.json();

  socket.emit(productsJSON); */

  fetch("http://localhost:8080/api/products")
    .then((res) => res.json())
    .then((data) => {
      socket.emit("fetchProductos", data);
    })
    .catch((error) => console.error(error));

/*   socket.emit("saludo", "Bienvenido a Websocket");
  socket.on("respuestaSaludo", (mensaje) => {
    console.log("Respuesta mensaje: ", mensaje);
  });
  socket.on("mensaje", (obj) => {
    mensajes.push(obj);
    socketServer.emit("respuestaMensaje", mensajes);
  }); */
  socket.on("newProduct", (obj) => {
    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.product.error) {
          socket.emit("error", data.product.error);
          return;
        }
        fetch("http://localhost:8080/api/products")
          .then((res) => res.json())
          .then((data) => {
            socketServer.emit("productAdded", data);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  });
});
