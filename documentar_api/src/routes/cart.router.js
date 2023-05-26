/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the cart
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *           productId:
 *             type: string
 *             description: The id of the product
 *           quantity:
 *             type: number
 *             description: The quantity of the product
 */

import { Router } from "express";
import { cartVerification } from "../middlewares/cartVerification.js";
import {
	cartById,
	createCart,
	getAllCarts,
	addProductToCart,
	addArrayToCart,
	updateByQuery,
	deleteCById,
	deleteProductFromCart,
	deleteAll,
} from "../controllers/carts.controller.js";

import { stockVerification } from "../middlewares/stockVerification.js";
import {
	deleteTicketById,
	getAllTickets,
	purchaseGenerator,
	deleteTickets,
} from "../controllers/tickets.controller.js";
const router = Router();

router.get("/tickets", getAllTickets);

router.delete("/:tid/tickets", deleteTicketById);

router.delete("/tickets", deleteTickets);

router.get("/", getAllCarts);

router.get("/:cid", cartById);

router.post("/:cid/purchase", stockVerification, purchaseGenerator);

router.post("/", cartVerification, createCart);

router.post("/:cid/product/:pid", addProductToCart);

router.put("/:cid", addArrayToCart);

router.put("/:cid/products/:pid", updateByQuery);

router.delete("/", deleteAll);

router.delete("/:cid", deleteCById);

router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
