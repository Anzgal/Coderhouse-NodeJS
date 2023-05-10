import { productsModel } from "../models/product.model.js";
import { errors } from "../../errors/errors.dictionary.js";
import CustomError from "../../errors/customError.js";

export default class ProductManager {
	async getProducts() {
		return await productsModel.find({}).lean();
	}

	async addProduct(obj) {
		const {
			title,
			description,
			code,
			price,
			status = true,
			stock,
			category,
			thumbnail = [],
		} = obj;
		const products = await this.getProducts();

		if (!title || !description || !code || !price || !stock || !category) {
			CustomError.createError(errors.BadRequest);
		}

		if (products.some((product) => product.code === code)) {
			CustomError.createError(errors.BadRequest);
		}
		return await productsModel.create(obj);
	}

	async aggregationFunc(ctg, srt) {
		if (!ctg) {
			return { message: "Producto no encontrado" };
		} else {
			const ctgy = await productsModel.aggregate([
				{
					$match: { category: { $eq: `${ctg}` }, price: { $exists: true } },
				},
				{
					$sort: { price: srt },
				},
			]);
			return ctgy;
		}
	}
	async getProductById(id) {
		return await productsModel.findById(id);
	}

	async updateProduct(pid, fieldToUpdate) {
		const filter = { _id: pid };
		return await productsModel.findOneAndUpdate(filter, fieldToUpdate, {
			new: true,
		});
	}

	async deleteById(pid) {
		const filter = { _id: pid };
		const deletedProduct = await productsModel.findOneAndDelete(filter);
		return deletedProduct;
	}

	async deleteAll() {
		return await productsModel.deleteMany();
	}

	async paginateProduct(query, options) {
		const products = await productsModel.paginate(query, options);
		return products;
	}

	async listToShow(id) {
		let products = await this.getProducts();
		if (products.length === 0) {
			return products;
		} else if (id) {
			let productsListFiltered = products.filter((u) => u.id !== id);
			let productsList = productsListFiltered.map((product) => {
				let productSimplificado = {
					title: product.title,
					price: product.price,
				};
				return productSimplificado;
			});
			return productsList;
		} else {
			let productsList = [];
			productsList = products.map((product) => {
				let productSimplificado = {
					title: product.title,
					price: product.price,
				};
				return productSimplificado;
			});
			return productsList;
		}
	}
}
