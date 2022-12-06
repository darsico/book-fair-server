import { Schema, model } from "mongoose";

const orderSchema = new Schema({

 books: [{
  quantity: {
   type: Number,
   required: true
  },
  book: {
   type: Schema.Types.ObjectId,
   ref: "Book",
  }
 }],
 seller: {
  type: Schema.Types.ObjectId,
  ref: "Seller"
 },
 buyer: {
  type: Schema.Types.ObjectId,
  ref: "Buyer"
 },
 total: {
  type: Number,
  required: true,
 },
}, {
 timestamps: true,
 versionKey: false
});
export default model('Order', orderSchema)  