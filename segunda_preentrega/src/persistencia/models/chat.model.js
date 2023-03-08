import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    require: true,
  },
});

export const messagesModel = mongoose.model("Messages", chatSchema);
