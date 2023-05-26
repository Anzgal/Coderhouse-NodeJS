import CartManagerMongo from "./mongoManager/cartManager.js";
import ProductManagerMongo from "./mongoManager/productsManager.js";
import UserManagerMongo from "./mongoManager/userManager.js";
import TicketManagerMongo from "./mongoManager/ticketManager.js";


let cartDao;
let productsDao;
let usersDao;
let ticketsDao;

await import("./dbConfig.js");
cartDao = new CartManagerMongo();
productsDao = new ProductManagerMongo();
usersDao = new UserManagerMongo();
ticketsDao = new TicketManagerMongo();


export {cartDao,productsDao,usersDao, ticketsDao};