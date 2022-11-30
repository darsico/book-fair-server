import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const sellerSchema = new Schema({
 name: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  required: true,
 },
 password: {
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
 roles: [{
  ref: "Role",
  type: Schema.Types.ObjectId,
 }],

}, {
 timestamps: true,
 versionKey: false
});

sellerSchema.statics.encryptPassword = async (password) => {
 const salt = await bcrypt.genSalt(10);
 return await bcrypt.hash(password, salt);
};

sellerSchema.statics.comparePassword = async (password, receivedPassword) => {
 return await bcrypt.compare(password, receivedPassword);
};


export default model('Seller', sellerSchema)  