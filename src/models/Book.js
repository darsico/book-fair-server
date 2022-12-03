import { Schema, model } from "mongoose";

const bookSchema = new Schema({
 author: {
  type: String,
  required: true
 },
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
  default: "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg",
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
