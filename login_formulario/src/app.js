import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";

//ROUTERS
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import sessionRouter from "./routes/session.router.js";
import userRouter from "./routes/user.router.js";

import ProductManager from "./persistencia/dao/productsManager.js";
import MessagesManager from "./persistencia/dao/messagesManager.js";

import "./persistencia/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "secretCoder",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 50000 },
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI_SESSION,
      ttl: 120000,
    }),
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionRouter);
app.use("api/users", userRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando puerto : ${PORT}`);
});

const socketServer = new Server(httpServer);

const newProductsArray = [];

const productManager = new ProductManager();
const messagesManager = new MessagesManager();

socketServer.on("connection", async (socket) => {
  console.log("CONECTADO");
  let productsListServer = await productManager.listToShow();
  socketServer.emit("productsList", productsListServer);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });

  socket.on("dataForm", async (dataForm) => {
    let productsListServer = await productManager.listToShow();
    productsListServer.push(dataForm);
    socketServer.emit("productsList", productsListServer);
  });

  socket.on("dataDeleted", async (data) => {
    const { id } = data;
    let productsListServer = await productManager.listToShow(id);
    socketServer.emit("productsListDeleted", productsListServer);
  });

  socket.on("newUser", (usuario) => {
    socket.broadcast.emit("broadcast", usuario);
  });

  socket.on("messageChat", async (data) => {
    await messagesManager.createMessages(data);
    const messages = await messagesManager.getMessages();
    socketServer.emit("messageLogs", messages);
  });
});
