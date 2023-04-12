import { Router } from "express";
import CartManager from "../dao/mongoManager/cartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  res.json(carts);
});

router.get("/:cId", async (req, res) => {
  try {
    const { cId } = req.params;
    const cart = await cartManager.getCartbyId(cId);
    if (cart) {
      const cartProducts = cart[0].products;
      res.render("cart", { cartProducts });
    } else {
      res.json({ mensage: "Carrito no encontrado" });
    }
  } catch (error) {
    return { error };
  }
});

router.post("/", async (req, res) => {
  res.status(200).json(await cartManager.createCart());
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const respuesta = await cartManager.addToCart(cid, pid);
    if (!respuesta) {
      res.json({ mensage: "Carrito no encontrado" });
    } else {
      res.json(respuesta);
    }
  } catch (error) {
    return { error };
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const productsUpdated = await cartManager.updateCartProductsByArray(
      cid,
      products
    );
    if (productsUpdated) {
      res.json(productsUpdated);
    } else {
      res.json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    return { error };
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  const { cid, pid } = req.params;
  const updatedProduct = await cartManager.updateQuantityByQuery(
    cid,
    pid,
    quantity
  );
  res.json(updatedProduct);
});

router.delete("/", async (req, res) => {
  try {
    const response = await cartManager.deleteAllCarts();
    res.json({ mensaje: "Carritos eliminados con exito", cantidad: response });
  } catch (error) {
    return { error };
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const deletedCart = await cartManager.deleteCartById(cid);
    res.status(200).json({ "Carrito eliminado con exito: ": deletedCart });
  } catch (error) {
    return { error };
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const productDeletedFromCart = await cartManager.deleteProductCart(cid, pid);
  if (productDeletedFromCart) {
    res.json({ "Producto eliminado con exito": productDeletedFromCart });
  } else {
    res.json({ error: "Producto no encontrado" });
  }
});

export default router;
