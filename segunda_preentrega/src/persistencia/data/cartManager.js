import { cartModel } from "../models/cart.model.js";
import { productsModel } from "../models/product.model.js";

export default class CartManager {
  async addToCart(id) {
    try {
      const getProd = await productsModel.find({ _id: id });

      const compare = await cartModel.find({ idProd: id });

      if (compare.length === 0) {
        const adding = await cartModel.insertMany({
          idProd: getProd[0]._id,
          name: getProd[0].name,
          quantity: 1,
        });
        return { adding };
      } else {
        await cartModel.updateOne({ idProd: id }, { $inc: { quantity: +1 } });
        return "Se agregó una unidad.";
      }
    } catch (error) {
      return error;
    }
  }

  async getPurchases() {
    try {
      const getPurchases = await cartModel.find();
      return getPurchases;
    } catch (error) {
      return error;
    }
  }

  async getPurchaseById(id) {
    try {
      const getPurchasesById = await cartModel.find({ _id: id });
      return getPurchasesById;
    } catch (error) {
      return error;
    }
  }

  async deletePurchase(id) {
    try {
      const delProd = await cartModel.deleteOne({ _id: id });
      return "Producto eliminado";
    } catch (error) {
      return error;
    }
  }
}
