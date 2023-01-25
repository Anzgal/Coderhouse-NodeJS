import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts() {
    if (fs.existsSync(this.path)) {
      const productos = fs.readFileSync(this.path, "utf-8");
      const productosJS = JSON.parse(productos);
      return productosJS;
    } else {
      console.log("File does not exist!");
      return [];
    }
  }

  getProductById(productId) {
    const productosFile = this.getProducts();
    const product = productosFile.find((product) => product.id === productId);

    if (product) {
      return product;
    } else {
      console.log("Product not found!");
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
        console.log("Product not found!");
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
          console.log("Product not found!");
        }
      } else {
        console.log("File not found!");
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

export {ProductManager};