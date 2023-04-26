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

export const getAllCarts = async (req, res) => {
	const carts = await getCarts();
	res.json(carts);
};

export const cartById = async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await getCartbyId(cid);
		if (cart) {
			const cartProducts = cart[0].products;
			res.render("cart", { cartProducts });
		} else {
			res.json({ mensaje: "Cart not found" });
		}
	} catch (error) {
		console.log(error);
	}
};

export const createCart = async (req, res) => {
	const cartId = req.session.userInfo.associatedCart;
	res.status(200).json({ cartId });
};

export const addProducToCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const respuesta = await addToCart(cid, pid);
		if (!respuesta) {
			res.json({ mensage: "Cart not found" });
		} else {
			res.json(respuesta);
		}
	} catch (error) {
		console.log(error);
	}
};

export const addArrayToCart = async (req, res) => {
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
		console.log(error);
	}
};

export const updateByQuery = async (req, res) => {
	const { quantity } = req.body;
	const { cid, pid } = req.params;
	const updatedProduct = await updateQuantityByQuery(cid, pid, quantity);
	res.json(updatedProduct);
};

export const deleteAll = async (req, res) => {
	try {
		const response = await deleteAllCarts();
		res.json({ mensaje: "Carts deleted succesfully", cantidad: response });
	} catch (error) {
		console.log(error);
	}
};

export const deleteCById = async (req, res) => {
	try {
		const { cid } = req.params;

		const deletedCart = await deleteCartById(cid);
		res.status(200).json({ "Cart deleted succesfully: ": deletedCart });
	} catch (error) {
		console.log(error);
	}
};

export const deleteProductFromCart = async (req, res) => {
	const { cid, pid } = req.params;

	const productDeletedFromCart = await deleteProductCart(cid, pid);
	if (productDeletedFromCart) {
		res.json({ "Product deleted succesfully": productDeletedFromCart });
	} else {
		res.json({ error: "Product not found" });
	}
};
