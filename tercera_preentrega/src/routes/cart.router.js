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

const router = Router();

router.get("/", getAllCarts);

router.get("/:cid", cartById);

router.post("/", cartVerification, createCart);

router.post("/:cid/product/:pid", addProducToCart);

router.put("/:cid", addArrayToCart);

router.put("/:cid/products/:pid", updateByQuery);

router.delete("/", deleteAll);

router.delete("/:cid", deleteCById);

router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
