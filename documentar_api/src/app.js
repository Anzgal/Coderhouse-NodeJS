import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";

//ROUTERS
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import sessionRouter from "./routes/session.router.js";
import userRouter from "./routes/user.router.js";
import mailerRoute from "./routes/mailer.router.js";
import mensajesRouter from "./routes/twilio.router.js";
import testUsers from "./routes/mocks.router.js";
import loggerTestRouter from "./routes/loggerTest.router.js";
import artilleryTest from "./routes/artilleryTest.router.js";

import compression from "express-compression";

import ProductManager from "./dao/mongoManager/productsManager.js";
import { MessagesManager } from "./dao/mongoManager/messagesManager.js";
import UserManager from "./dao/mongoManager/userManager.js";

import { errorsMiddleware } from "./middlewares/errorMiddleware.js";

import "./dao/dbConfig.js";
import "./passport/passportStrategies.js";

//EXPRESS
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression({ brotli: { enabled: true, zlib: {} } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

const sessionOptions = {
	secret: "secretCoder",
	resave: false,
	saveUninitialized: true,
};
sessionOptions.store = new MongoStore({
	mongoUrl: process.env.MONGO_URI_SESSION,
});

app.use(session(sessionOptions));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);
app.use("/api/mail", mailerRoute);
app.use("/api/mensajes", mensajesRouter);
app.use("/", testUsers);
app.use("/api/loggerTest", loggerTestRouter);
app.use("/artilleryTest", artilleryTest);

//handlebars

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const hbs = handlebars.create({
	helpers: {
		partial: function (name) {
			return name;
		},
	},
});

app.engine("handlebars", hbs.engine);

//SERVER
const httpServer = app.listen(PORT, () => {
	console.log(`Escuchando puerto : ${PORT}`);
});

//SOCKET
const socketServer = new Server(httpServer);

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

app.use(errorsMiddleware);
