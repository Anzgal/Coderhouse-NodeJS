import fs from "fs";

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
      return { error: "File does not exist!" };
    }
  }

  getProductById(productId) {
    const productosFile = this.getProducts();
    const product = productosFile.find((product) => product.id === productId);

    if (product) {
      return product;
    } else {
      return { error: "Product not found!" };
    }
  }

  async addProduct(producto) {
    if (
      !producto.title ||
      !producto.description ||
      !producto.price ||
      !producto.code ||
      !producto.stock
    ) {
      return {
        error: "There is a missing field!",
      };
    } else {
      const productosFile = this.getProducts();
      const productByCode = productosFile.find(
        (product) => product.code === producto.code
      );
      if (productByCode) {
        return { error: "Code is repeated!" };
      } else {
        try {
          const newProduct = {
            id: this.#generarId(),
            status: true,
            thumbnails: producto.thumbnails || [],
            ...producto,
          };
          productosFile.push(newProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(productosFile));
          return newProduct;
        } catch (error) {
          return error;
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
          return {
            success: `Product ${id} modified successfully.`,
          };
        } catch (error) {
          return { error };
        }
      } else {
        return {
          error: "Product not found!",
        };
      }
    } catch (error) {
      return { error };
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
          return {
            success: `Product ${id} removed successfully.`,
          };
        } else {
          return {
            error: "Product not found!",
          };
        }
      } else {
        return {
          error: "File not found!",
        };
      }
    } catch (error) {
      return { error };
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

export default ProductManager;
