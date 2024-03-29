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

export const getAllCarts = async (req, res, next) => {
	try {
		const carts = await getCarts();
		res.json(carts);
	} catch (error) {
		next(error);
	}
};

export const cartById = async (req, res, next) => {
	try {
		const { cid } = req.params;
		const cart = await getCartbyId(cid);
		if (cart) {
            console.log(cart)
            res.render("cart",{cart})
		} else {
			res.json({ mensaje: "Cart not found" });
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
	} catch (error) {
		next(error);
	}
};

export const addProductToCart = async (req, res, next) => {
	try {
		const { cid, pid } = req.params;
		const respuesta = await addToCart(cid, pid);
		res.json(respuesta);
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
		} else {
			res.json({ mensaje: "Cart not found" });
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
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		const response = await deleteAllCarts();
		res.json({ mensaje: "Carts deleted succesfully", cantidad: response });
	} catch (error) {
		next(error);
	}
};

export const deleteCById = async (req, res, next) => {
	try {
		const { cid } = req.params;

		const deletedCart = await deleteCartById(cid);
		res.status(200).json({ "Cart deleted succesfully: ": deletedCart });
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
		} else {
			res.json({ error: "producto no encontrado" });
		}
	} catch (error) {
		next(error);
	}
};
