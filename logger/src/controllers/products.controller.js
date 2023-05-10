import {
	getProducts,
	addProduct,
	aggregation,
	getProductById,
	updateProduct,
	deleteById,
	deleteAll,
	paginateProduct,
} from "../services/products.service.js";
import logger from "../utils/winston.js";

export const getAllProducts = async (req, res, next) => {
	try {
		let { limit = 10, page = 1, sort, category } = req.query;

		category ? (category = { category }) : (category = null);

		const options = {
			limit,
			page,
		};
		sort ? (options.sort = { price: sort }) : options;

		const products = await paginateProduct(category, options);
		const status = products.docs ? "success" : "error";
		const prevLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null;
		const nextLink = products.hasNextPage ? `/api/products?page=${products.nextPage}` : null;

		res.json({
			results: {
				status,
				payload: products.docs,
				totalPages: products.totalPages,
				prevPage: products.prevPage,
				nextPage: products.nextPage,
				page: products.page,
				hasPrevPage: products.hasPrevPage,
				hasNextPage: products.hasNextPage,
				prevLink,
				nextLink,
			},
		});
		logger.info(`GET /api/products`);
	} catch (error) {
		next(error);
	}
};

export const aggregationFunction = async (req, res, next) => {
	try {
		const { category } = req.params;
		const { sort = 1 } = req.query;
		const productsFiltered = await aggregation(category, parseInt(sort));
		res.json({ productsFiltered });
		logger.info(`GET /api/products/${category}`);
	} catch (error) {
		next(error);
	}
};

export const productById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await getProductById(id);
		if (product) {
			res.json(product);
			logger.info(`GET /api/products/${id}`);
		} else {
			res.json({ mensage: "Product not found" });
			logger.error(`GET /api/products/${id} - Product not found`);
		}
	} catch (error) {
		next(error);
	}
};

export const addOneProduct = async (req, res, next) => {
	try {
		const objProduct = req.body;
		const newProduct = await addProduct(objProduct);

		if (newProduct === 401) {
			logger.error(`POST /api/products - Enter all required fields`);
			return res.status(400).json({ error: "Enter all required fields" });
		} else if (newProduct === 402) {
			logger.error(`POST /api/products - The code already exists`);
			return res.status(400).json({ error: "The code already exists" });
		} else {
			logger.info(`POST /api/products - Product added succesfully`);
			return res.status(200).json({ mensaje: "Product added succesfully", newProduct });
		}
	} catch (error) {
		next(error);
	}
};

export const addManyProducts = async (req, res, next) => {
	try {
		const products = req.body;

		for (const product of products) {
			const addedProduct = await addProduct(product);
			console.log(addedProduct);
			if (addedProduct === 401) {
				res.status(400).json({ error: "Enter all required fields" });
				logger.error(`POST /api/products - Enter all required fields`);
			} else if (addedProduct === 402) {
				res.status(400).json({ error: "The code already exists" });
				logger.error(`POST /api/products - The code already exists`);
			} else {
				console.log(`Product added succesfully: ${addedProduct}`);
				logger.info(`POST /api/products - Product added succesfully`);
			}
		}
		res.status(200).json({ mensaje: "Products added succesfully" });
	} catch (error) {
		next(error);
	}
};

export const modifyProduct = async (req, res, next) => {
	try {
		const { pid } = req.params;
		const update = req.body;
		const responseUpdated = await updateProduct(pid, update);
		res.json(responseUpdated);
		logger.info(`PUT /api/products/${pid}`);
	} catch (error) {
		next(error);
	}
};

export const deleteOne = async (req, res, next) => {
	try {
		const { pid } = req.params;

		const deletedProduct = await deleteById(pid);
		res.status(200).json({ "Product deleted succesfully: ": deletedProduct });
		logger.info(`DELETE /api/products/${pid}`);
	} catch (error) {
		next(error);
	}
};

export const deleteAllProducts = async (req, res, next) => {
	try {
		const response = await deleteAll();
		res.status(200).json({
			mensaje: "Products deleted succesfully",
			cantidad: response,
		});
		logger.info(`DELETE /api/products`);
	} catch (error) {
		next(error);
	}
};
