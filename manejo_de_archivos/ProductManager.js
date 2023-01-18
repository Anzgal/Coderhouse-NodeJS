const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  consultarProductos() {
    if (fs.existsSync(this.path)) {
      const productos = fs.readFileSync(this.path, "utf-8");
      const productosJS = JSON.parse(productos);
      return productosJS;
    } else {
      return [];
    }
  }

  getProductById(productId) {
    const productosFile = this.consultarProductos();
    const product = productosFile.find((product) => product.id === productId);

    if (product) {
      return product;
    } else {
      console.log("Product not found");
      return {};
    }
  }

  async crearProducto(producto) {
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
      const productosFile = this.consultarProductos();
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
      const productById = this.getProductById(id);
      if (productById) {
        const products = this.consultarProductos();
      } else {
        console.log("Product not found!");
      }
      
      const index = products.findIndex((p) => p.id === id);
      if (index >= 0) {
        products[index] = { ...products[index], ...product };
        await fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
        console.log("Producto actualizado");
      } else {
        throw new Error("El producto no existe");
      }
    } catch (error) {
      console.log(error);
    }
  }

  #generarId() {
    let id = 1;
    const productosFile = this.consultarProductos();
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
  const consultaProductos1 = productManager1.consultarProductos();
  console.log(consultaProductos1);

  await productManager1.crearProducto(producto1);
  const consultaProductos2 = productManager1.consultarProductos();
  console.log(consultaProductos2);

  const productById = productManager1.getProductById(1);
  console.log("PRODUCT BY ID (1):", productById);
  //await manager.crearUsuario(usuario2)
  //manager.updateUsuarios(1,{nombre:'Ernesto'})
}

prueba();
