import mongoose, { Schema, model } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Item = model("Item", itemSchema);

export default Item;
