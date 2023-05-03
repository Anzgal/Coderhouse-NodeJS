import { Router } from "express";
import { cartVerification } from "../middlewares/cartVerification.js";
import {
	cartById,
	createCart,
	getAllCarts,
	addProducToCart,
	addArrayToCart,
	updateByQuery,
	deleteCById,
	deleteProductFromCart,
	deleteAll,
} from "../controllers/carts.controller.js";
import { getTicket } from "../services/ticket.service.js";
import { stockVerification } from "../middlewares/stockVerification.js";
import { purchaseGenerator } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getAllCarts);

router.get("/tickets", async (req, res) => {
	const tickets = await getTicket();
	res.json({ tickets });
});

router.get("/:cid", cartById);

router.post("/:cid/purchase", stockVerification, purchaseGenerator);

router.post("/", cartVerification, createCart);

router.post("/:cid/product/:pid", addProducToCart);

router.put("/:cid", addArrayToCart);

router.put("/:cid/products/:pid", updateByQuery);

router.delete("/", deleteAll);

router.delete("/:cid", deleteCById);

router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
