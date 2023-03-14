import { Router } from "express";
import ProductManager from "../persistencia/dao/productsManager.js";
import { productsModel } from "../persistencia/models/product.model.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const { limit, page, sort, category } = req.query;

  const products = await productsModel.paginate(
    category ? { category: category } : null,
    { limit, page, sort: { price: sort || 1 } }
  );

  const status = products.docs ? "success" : "error";
  const prevLink = products.hasPrevPage
    ? `http://localhost:3000/api/products?page=${products.prevPage}`
    : null;
  const nextLink = products.hasNextPage
    ? `http://localhost:3000/api/products?page=${products.nextPage}`
    : null;

    res.json({results:{
        status,
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink,
        nextLink
    }})

/*   const products = await productManager.getProducts({ limit, page });
  if (products.length === 0) {
    res.json({ message: "No hay productos listados" });
  } else {
    const next = products.hasNextPage
      ? `http://localhost:3000/api/products?limit=${products.limit}&page=${products.nextPage}`
      : null;
    const prev = products.hasPrevPage
      ? `http://localhost:3000/api/products?limit=${products.limit}&page=${products.prevPage}`
      : null;
    res.json({
      message: "Listado de productos: ",
      products: products.docs,
      PrevPág: prev,
      PróxPág: next,
    });
  } */
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productManager.getProductById(id);

  if (product) {
    res.json({ message: "Resultado de su seleccion: ", product: product });
  } else {
    res.json({
      message: `Lamentablemente el Id ${id} no se encuentra listado.`,
    });
  }
});

router.post("/", async (req, res) => {
  const prod = req.body;
  const newProduct = await productManager.addProduct(prod);
  console.log("newProduct: ", newProduct);
  res.json({
    message: newProduct.errors
      ? "Ocurrió un error al crear el producto"
      : "Producto agregado correctamente",
    producto: newProduct,
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newValue = req.body;
  const field = Object.keys(newValue).toString();
  const value = Object.values(newValue).toString();

  const editProd = await productManager.updateProduct(id, field, value);
  res.json({ message: editProd });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const delProd = await productManager.deleteProduct(id);
  res.json({ message: delProd });
});

router.delete("/", async (req, res) => {
  const delFile = await productManager.deleteFile();
  res.json({ message: delFile });
});

export default router;
