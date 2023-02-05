import fs from "fs";

class CartManager {
  constructor(path, productsPath) {
    this.path = path;
    this.productsPath = productsPath;
  }

  getCarts() {
    if (fs.existsSync(this.path)) {
      const carts = fs.readFileSync(this.path, "utf-8");
      const cartsJS = JSON.parse(carts);
      return cartsJS;
    } else {
      console.log("File does not exist!");
      return [];
    }
  }

  getCartById(cartId) {
    const cartsFile = this.getCarts();
    const cart = cartsFile.find((cart) => cart.id === cartId);

    if (cart) {
      return cart;
    } else {
      return {
        error: "Cart not found!",
      };
    }
  }

  async addCart() {
    const cartsFile = this.getCarts();

    try {
      const newCart = {
        id: this.#generarId(),
        products: [],
      };
      cartsFile.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return newCart;
    } catch (error) {
      return error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cartsFile = this.getCarts();
      const cartIndex = cartsFile.findIndex((cart) => cart.id === cartId);

      const productsFile = this.#getProducts();
      const productIndex = productsFile.findIndex(
        (product) => product.id === productId
      );

      if (cartIndex >= 0) {
        if (productIndex >= 0) {
          try {
            let newProductsArray = [...cartsFile[cartIndex].products];
            const productFoundIndex = newProductsArray.findIndex((p) => p.product === productId);
            console.log({productFoundIndex});
            if (productFoundIndex >= 0) {
              newProductsArray[productFoundIndex].quantity++;
            } else{
              newProductsArray.push({
                product: productId,
                quantity: 1
              })
            }
            
            cartsFile[cartIndex] = {
              ...cartsFile[cartIndex],
              products: newProductsArray,
            };
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
            return {
              success: `Product ${productId} added to cart ${cartId} successfully.`,
            };
          } catch (error) {
            return { error };
          }
        } else {
          return {
            error: "Product not found!",
          };
        }
      } else {
        return {
          error: "Cart not found!",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  #getProducts() {
    if (fs.existsSync(this.path)) {
      const productos = fs.readFileSync(this.path, "utf-8");
      const productosJS = JSON.parse(productos);
      return productosJS;
    } else {
      console.log("File does not exist!");
      return [];
    }
  }

  #generarId() {
    let id = 1;
    const cartsFile = this.getCarts();
    if (cartsFile.length !== 0) {
      id = cartsFile[cartsFile.length - 1].id + 1;
    }
    return id;
  }
}

export default CartManager;
