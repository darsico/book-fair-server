import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
 name: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  required: true,
 },
 store: {
  type: String,
  required: true,
 },
 books: [{
  type: Schema.Types.ObjectId,
  ref: "Book"
 }],
 orders: [{
  type: Schema.Types.ObjectId,
  ref: "Order"
 }],
}, {
 timestamps: true,
 versionKey: false
});

export default model('Seller', sellerSchema)  