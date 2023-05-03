import { Router } from "express";
import {
	getAllProducts,
	aggregationFunction,
	productById,
	addOneProduct,
	modifyProduct,
	deleteOne,
	deleteAllProducts,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProducts);

router.get("/aggregation/:category", aggregationFunction);

router.get("/:id", productById);

router.post("/", addOneProduct);

router.put("/:pid", modifyProduct);

router.delete("/:pid", deleteOne);

router.delete("/", deleteAllProducts);

export default router;
