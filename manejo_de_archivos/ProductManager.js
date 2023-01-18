const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }


  async consultarProductos() {
    
    try {
      if (fs.existsSync(this.path)) {
        const productos = await fs.promises.readFile(this.path, 'utf-8')
        const productosJS = JSON.parse(productos)
        return productosJS
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }

  async crearProducto(producto) {
    try {
        const productosFile = await this.consultarProductos();
        const newProduct = {
          id: this.#generarId(productosFile),
          ...producto,
        };
        productosFile.push(newProduct);
        await fs.promises.writeFile(this.path,JSON.stringify(productosFile));
    } catch (error) {
        console.log(error);
    }
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

  #generarId(productosFile) {
    let id = 1;
    if (productosFile.length !== 0) {
      id = productosFile[productosFile.length - 1].id + 1;
      console.log("Length ADDED", productosFile.length);
    }
    return id;
  }

}

const productManager1 = new ProductManager('./Products.json');
/* console.log(productManager1.getProducts());
productManager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(productManager1.getProducts());
productManager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

productManager1.getProductById(2);
productManager1.getProductById(1); */

const producto1 = {
  "title": "producto Añadido",
  "description": "Este es un producto prueba",
  "price": 600,
  "thumbnail": "Sin imagen",
  "code": "abc987",
  "stock": 7
}

async function prueba() {
  const consultaProductos1 = await productManager1.consultarProductos();
  console.log(consultaProductos1)

  await productManager1.crearProducto(producto1);
  const consultaProductos2 = await productManager1.consultarProductos();
  console.log(consultaProductos2)
  //await manager.crearUsuario(usuario2)  
  //manager.updateUsuarios(1,{nombre:'Ernesto'})
}

prueba()