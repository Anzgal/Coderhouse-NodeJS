import { Router } from "express";
import ProductManager from "../persistencia/dao/productsManager.js";

const productManager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  const productos = await productManager.getProducts();
  res.render("home", { productos });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
