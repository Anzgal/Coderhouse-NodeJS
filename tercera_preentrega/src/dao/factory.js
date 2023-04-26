import CartManagerMongo from "./mongoManager/cartManager.js";
import ProductManagerMongo from "./mongoManager/productsManager.js";
import UserManagerMongo from "./mongoManager/userManager.js";



let cartDao;
let productsDao;
let usersDao;

await import("./dbConfig.js");
cartDao = new CartManagerMongo();
productsDao = new ProductManagerMongo();
usersDao = new UserManagerMongo();


export {cartDao,productsDao,usersDao};