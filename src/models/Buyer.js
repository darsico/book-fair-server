import { Schema, model } from "mongoose";

const buyerSchema = new Schema({
 name: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  required: true,
 },
 orders: [
  {
   type: Schema.Types.ObjectId,
   ref: "Order",
  },
 ],
}, {
 timestamps: true,
 versionKey: false
});
export default model('Buyer', buyerSchema)  
