import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const buyerSchema = new Schema({
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
 orders: [
  {
   type: Schema.Types.ObjectId,
   ref: "Order",
  },
 ],
 roles: [
  {
   ref: "Role",
   type: Schema.Types.ObjectId,
  },
 ],
}, {
 timestamps: true,
 versionKey: false
});

buyerSchema.statics.encryptPassword = async (password) => {
 const salt = await bcrypt.genSalt(10);
 return await bcrypt.hash(password, salt);
};

buyerSchema.statics.comparePassword = async (password, receivedPassword) => {
 return await bcrypt.compare(password, receivedPassword);
};


export default model('Buyer', buyerSchema)  
