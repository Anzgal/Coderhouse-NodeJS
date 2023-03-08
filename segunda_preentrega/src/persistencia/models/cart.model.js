import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  idProd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export const cartModel = mongoose.model("Cart", cartSchema);
