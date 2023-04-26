import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Products",
			},
			quantity: {
				type: Number,
			},
		},
	],
});

cartsSchema.pre("find", function (next) {
	this.populate("products.productId");
	next();
});

export const cartModel = mongoose.model("Carts", cartsSchema);
