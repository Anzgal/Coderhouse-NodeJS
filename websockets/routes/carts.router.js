import { Router } from "express";
import CartManager from "../src/CartManager.js";

const router = Router();

const cartManager1 = new CartManager("./data/Carts.json", "./data/Products.json");

/*
router.get("/", (req, res) => {
  let products = cartManager1.getCarts();
  if (req.query.limit && !isNaN(parseInt(req.query.limit))) {
    products = products.slice(0, parseInt(req.query.limit));
  }
  return res.status(200).json({ products });
});
*/

router.get("/:cid", (req, res) => {
  if (req.params.cid && !isNaN(parseInt(req.params.cid))) {
    const cart = cartManager1.getCartById(parseInt(req.params.cid));
    return res.json({ cart });
  } else {
    return res.status(400).json({ error: "Insert a valid numeric id!" });
  }
});

router.post("/", async (req, res) => {
  const cart = await cartManager1.addCart();
  return res.json({ cart });
});

router.post("/:cid/product/:pid", async (req, res) => {
  if (
    req.params.pid &&
    req.params.cid &&
    !isNaN(parseInt(req.params.pid)) &&
    !isNaN(parseInt(req.params.cid))
  ) {
    const cart = await cartManager1.addProductToCart(parseInt(req.params.cid),parseInt(req.params.pid));
    return res.json(cart);
  } else {
    return res.status(400).json({ error: "Insert a valid numeric id!" });
  }
});

router.put("/:pid", async (req, res) => {
  const newValue = req.body;
  if (req.params.pid && !isNaN(parseInt(req.params.pid))) {
    const product = await cartManager1.updateProduct(
      parseInt(req.params.pid),
      newValue
    );
    return res.json(product);
  } else {
    return res.status(400).json({ error: "Insert a valid numeric id!" });
  }
});

router.delete("/:pid", async (req, res) => {
  if (req.params.pid && !isNaN(parseInt(req.params.pid))) {
    const product = await cartManager1.deleteProduct(parseInt(req.params.pid));
    return res.json(product);
  } else {
    return res.status(400).json({ error: "Insert a valid numeric id!" });
  }
});

export default router;
