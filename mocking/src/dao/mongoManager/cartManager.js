import { cartModel } from "../models/cart.model.js";

export default class CartManager {
	async getCarts() {
		try {
			const carts = await cartModel.find({}).lean();
			console.log(carts);
			return carts;
		} catch (error) {
			return { error };
		}
	}

	async getCartbyId(cId) {
		try {
			return await cartModel.find({ _id: cId }).lean();
		} catch (error) {
			return { error };
		}
	}

	async createACart() {
		try {
			const newCart = await cartModel.create({});
			return newCart;
		} catch (error) {
			return { error };
		}
	}

	async addToCart(cid, pid) {
		try {
			const cart = await cartModel.findById(cid);

			if (!cart) {
				return cart;
			} else {
				if (cart.products.length !== 0) {
					const productIndex = cart.products.findIndex((e) => e.productId == pid);

					if (productIndex !== -1) {
						let updateQ = await cartModel.updateOne(
							{ _id: cid, "products.productId": pid },
							{ $inc: { "products.$.quantity": 1 } }
						);
						return updateQ;
					} else {
						const pushProduct = cartModel.updateOne(
							{ _id: cid },
							{
								$push: {
									products: {
										productId: pid,
										quantity: 1,
									},
								},
							}
						);
						return pushProduct;
					}
				} else {
					{
						const pushProduct = cartModel.updateOne(
							{ _id: cid },
							{
								$push: {
									products: {
										productId: pid,
										quantity: 1,
									},
								},
							}
						);
						return pushProduct;
					}
				}
			}
		} catch (error) {
			return { error };
		}
	}

	async updateQuantityByQuery(cid, pid, quantity) {
		try {
			const filter = { _id: cid, "products.productId": pid };
			const update = { $set: { "products.$.quantity": quantity } };
			const updatedCartProduct = await cartModel.findOneAndUpdate(filter, update, {
				new: true,
			});
			return updatedCartProduct;
		} catch (error) {
			return { error };
		}
	}

	async updateCartProductsByArray(cid, arrayToUpdate) {
		try {
			const updateCartProducts = await cartsModel.findOneAndReplace(
				{ _id: cid },
				{ products: arrayToUpdate },
				{ returnDocument: "after" }
			);
			return updateCartProducts;
		} catch (error) {
			return { error };
		}
	}

	async deleteAllCarts() {
		const deletedCarts = await cartModel.deleteMany();
		return deletedCarts;
	}

	async deleteCartById(cid) {
		try {
			const filter = { _id: cid };
			const update = { products: [] };
			const deletedCart = await cartModel.findOneAndUpdate(filter, update, {
				new: true,
			});
			return deletedCart;
		} catch (error) {
			return { error };
		}
	}

	async deleteProductCart(cid, pid) {
		try {
			const idCart = await cartModel.findById(cid);

			if (idCart !== undefined) {
				const productToDeleteIndex = idCart.products.findIndex((e) => e.productId == pid);

				if (productToDeleteIndex !== -1) {
					idCart.products.splice(productToDeleteIndex, 1);
					const updatedCart = await idCart.save();
					return updatedCart;
				} else {
					return undefined;
				}
			} else {
				return idCart;
			}
		} catch (error) {
			return { error };
		}
	}
}
