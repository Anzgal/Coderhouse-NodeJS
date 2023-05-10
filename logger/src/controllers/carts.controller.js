import {
	getCarts,
	getCartbyId,
	createACart,
	addToCart,
	updateCartProductsByArray,
	updateQuantityByQuery,
	deleteAllCarts,
	deleteCartById,
	deleteProductCart,
} from "../services/cart.service.js";
import logger from "../utils/winston.js";

export const getAllCarts = async (req, res, next) => {
	try {
		const carts = await getCarts();
		res.json(carts);
		logger.info("Carts list");
	} catch (error) {
		next(error);
	}
};

export const cartById = async (req, res, next) => {
	try {
		const { cid } = req.params;
		const cart = await getCartbyId(cid);
		if (cart.length) {
			const cartProducts = cart.products;
			res.render("cart", { cartProducts });
			logger.info("Cart by id");
		} else {
			res.json({ mensaje: "Cart not found" });
			logger.error("Cart not found");
		}
	} catch (error) {
		next(error);
	}
};

export const createCart = async (req, res, next) => {
	try {
		const cartId = req.session.userInfo.associatedCart;
		res.status(200).json({
			cartId,
		});
		logger.info("Cart created");
	} catch (error) {
		next(error);
	}
};

export const addProductToCart = async (req, res, next) => {
	try {
		const { cid, pid } = req.params;
		const respuesta = await addToCart(cid, pid);
		res.json(respuesta);
		logger.info("Product added to cart");
	} catch (error) {
		next(error);
	}
};

export const addArrayToCart = async (req, res, next) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;
		const productsUpdated = await updateCartProductsByArray(cid, products);
		if (productsUpdated) {
			res.json(productsUpdated);
			logger.info("Products added to cart");
		} else {
			res.json({ mensaje: "Cart not found" });
			logger.error("Cart not found");
		}
	} catch (error) {
		next(error);
	}
};

export const updateByQuery = async (req, res, next) => {
	try {
		const { quantity } = req.body;
		const { cid, pid } = req.params;
		const updatedProduct = await updateQuantityByQuery(cid, pid, quantity);
		res.json(updatedProduct);
		logger.info("Product updated");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		const response = await deleteAllCarts();
		res.json({ mensaje: "Carts deleted succesfully", cantidad: response });
		logger.info("Carts deleted");
	} catch (error) {
		next(error);
	}
};

export const deleteCById = async (req, res, next) => {
	try {
		const { cid } = req.params;

		const deletedCart = await deleteCartById(cid);
		res.status(200).json({ "Cart deleted succesfully: ": deletedCart });
		logger.info("Cart deleted");
	} catch (error) {
		next(error);
	}
};

export const deleteProductFromCart = async (req, res, next) => {
	try {
		const { cid, pid } = req.params;
		const productDeletedFromCart = await deleteProductCart(cid, pid);
		if (productDeletedFromCart) {
			res.json({ "producto eliminado con exito": productDeletedFromCart });
			logger.info("Product deleted from cart");
		} else {
			res.json({ error: "producto no encontrado" });
			logger.error("Product not found");
		}
	} catch (error) {
		next(error);
	}
};
