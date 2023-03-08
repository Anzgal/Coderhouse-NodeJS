import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import cartRouter from "./routes/cart.router.js";
import chatRouter from "./routes/chat.router.js";
import productsRouter from "./routes/products.router.js";
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

app.use("/api/cart", cartRouter);
app.use("/chat", chatRouter);
app.use("/api/products", productsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando puerto : ${PORT}`);
});

export const socketServer = new Server(httpServer);

const infoMessages = [];

socketServer.on("connection", (socket) => {
  console.log(`Conected User: ${socket.id}`);

  socket.on("disconnected", (msg) => {
    console.log("# Desconnected User.");
  });

  socket.on("newUser", (usuario) => {
    socket.broadcast.emit("broadcast", usuario);
  });

  socket.on("mensaje", (info) => {
    infoMessages.push(info);
    socketServer.emit("chat", infoMessages);
  });
});
