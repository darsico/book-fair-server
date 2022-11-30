import { Schema, model } from "mongoose";

const bookSchema = new Schema({
 title: {
  type: String,
  required: true,
 },
 description: {
  type: String,
  required: true,
 },
 price: {
  type: Number,
  required: true,
 },
 image: {
  type: String,
  default: "https://images.unsplash.com/photo-1542732270-4a7a7b68f71c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMGJ1aWxkfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
 },
 seller: {
  type: Schema.Types.ObjectId,
  ref: "Seller",
 },
 stock: {
  type: Number,
  required: true,
 },
}, {
 timestamps: true,
 versionKey: false
})
export default model('Book', bookSchema)  
