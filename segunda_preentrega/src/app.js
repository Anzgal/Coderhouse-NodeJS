import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import cartRouter from "./routes/cart.router.js";
import chatRouter from "./routes/chat.router.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import { MessagesManager } from "./persistencia/dao/messagesManager.js";
import ProductManager from "./persistencia/dao/productsManager.js";
import { Server } from "socket.io";
import "./persistencia/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando puerto : ${PORT}`);
});


const socketServer = new Server(httpServer)

const newProductsArray = []

const productManager = new ProductManager();

socketServer.on("connection", async (socket) => {
  console.log("CONECTADO");
  let productsListServer = await productManager.listToShow();    
  socketServer.emit("productsList", productsListServer)

  socket.on("disconnect", () => {
      console.log("Usuario desconectado")
  });

  socket.on("dataForm", async (dataForm) => {
      let productsListServer = await productManager.listToShow();       
      productsListServer.push(dataForm);
      socketServer.emit("productsList", productsListServer);
  });

  socket.on("dataDeleted", async (data) => {
      const { id } = data;
      let productsListServer = await productManager.listToShow(id);
      socketServer.emit("productsListDeleted", productsListServer)
  })

  //RELACIONADO AL CHAT

  //recibimos el usuario nuevo registrado para avisar a todos los conectados que se conectó

  socket.on("newUser", (usuario) => {
      socket.broadcast.emit("broadcast", usuario);
  })


  //aca recibo la informacion del mensaje, que usuario lo envió y el contenido del mensaje 
  socket.on("messageChat", async (data) => {
      await messagesManager.createMessages(data);
      const messages = await messagesManager.getMessages();
      socketServer.emit("messageLogs", messages)
  }
  )




})

