class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("There's a mising field!");
    } else {
      const productByCode = this.products.find((product) => product.code === code);

      if (productByCode) {
        console.log("Code is repeated!");
      } else {
        const producto = {
          id: this.#generarId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.products.push(producto);
        console.log("Product added successfully.");
      }
      
    }
    
  }
  getProductById (productId) {
    const product = this.products.find((product) => product.id === productId);

    if (product) {
      console.log(product);
    } else {
      console.log("Not found!");
    }
  }

  #generarId() {
    let id = 1;
    if (this.products.length !== 0) {
      id = this.products[this.products.length - 1].id + 1;
    }
    return id;
  }

}

const productManager1 = new ProductManager();
console.log(productManager1.getProducts());
productManager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(productManager1.getProducts());
productManager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

productManager1.getProductById(2);
productManager1.getProductById(1);