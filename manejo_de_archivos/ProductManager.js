const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  getProducts() {
    if (fs.existsSync(this.path)) {
      const productos = fs.readFileSync(this.path, "utf-8");
      const productosJS = JSON.parse(productos);
      return productosJS;
    } else {
      return [];
    }
  }

  getProductById(productId) {
    const productosFile = this.getProducts();
    const product = productosFile.find((product) => product.id === productId);

    if (product) {
      return product;
    } else {
      console.log("Product not found");
      return {};
    }
  }

  async addProduct(producto) {
    if (
      !producto.title ||
      !producto.description ||
      !producto.price ||
      !producto.thumbnail ||
      !producto.code ||
      !producto.stock
    ) {
      console.log("There's a mising field!");
    } else {
      const productosFile = this.getProducts();
      const productByCode = productosFile.find(
        (product) => product.code === producto.code
      );
      if (productByCode) {
        console.log("Code is repeated!");
      } else {
        try {
          const newProduct = {
            id: this.#generarId(),
            ...producto,
          };
          productosFile.push(newProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(productosFile));
          console.log("Product added successfully.");
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async updateProduct(id, product) {
    try {
      const productosFile = this.getProducts();
      const productIndex = productosFile.findIndex(
        (producto) => producto.id === id
      );

      if (productIndex >= 0) {
        try {
          productosFile[productIndex] = {
            ...productosFile[productIndex],
            ...product,
          };
          await fs.promises.writeFile(this.path, JSON.stringify(productosFile));
          console.log("Product updated");
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Product not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const productosFile = this.getProducts();
      if (productosFile) {
        const productIndex = productosFile.findIndex((p) => p.id === id);
        if (productIndex >= 0) {
          productosFile.splice(productIndex, 1);

          await fs.promises.writeFile(this.path, JSON.stringify(productosFile));
          console.log("Product deleted", productosFile);
        } else {
          console.log("El producto no existe");
        }
      } else {
        console.log("El archivo no existe");
      }
    } catch (error) {
      console.log(error);
    }
  }

  #generarId() {
    let id = 1;
    const productosFile = this.getProducts();
    if (productosFile.length !== 0) {
      id = productosFile[productosFile.length - 1].id + 1;
    }
    return id;
  }
}

const productManager1 = new ProductManager("./Products.json");
/* console.log(productManager1.getProducts());
productManager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(productManager1.getProducts());
productManager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

productManager1.getProductById(2);
productManager1.getProductById(1); */

const producto1 = {
  title: "producto Añadido",
  description: "Este es un producto prueba",
  price: 600,
  thumbnail: "Sin imagen",
  code: "abc987",
  stock: 7,
};

async function prueba() {
  const consultaProductos1 = productManager1.getProducts();
  console.log(consultaProductos1);

  await productManager1.addProduct(producto1);
  const consultaProductos2 = productManager1.getProducts();
  console.log("After add", consultaProductos2);

  const productById = productManager1.getProductById(1);
  console.log("PRODUCT BY ID (1):", productById);

  await productManager1.updateProduct(3, {
    title: "producto actualizado",
    description: "descripcion actualizada",
    price: 1,
    code: "a",
    stock: 0,
  });
  const consultaProductos3 = productManager1.getProducts();
  console.log("After update", consultaProductos3);

  await productManager1.deleteProduct(2);
  const consultaProductos4 = productManager1.getProducts();
  console.log("After delete", consultaProductos4);
}

prueba();
