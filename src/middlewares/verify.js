import Buyer from "../models/Buyer";
import Seller from "../models/Seller";
import { validateEmail } from "../utils/validateEmail";


export const checkForm = async (req, res, next) => {
 try {
  const { email = false, password = false, role, store } = req.body;

  if (!role) return res.status(400).json({ message: 'Role is required' })
  if (!password) return res.status(400).json({ message: 'Password is required' })
  if (!email) res.status(400).json({ message: "Email is required" });
  if (email && !validateEmail(email)) res.status(400).json({
   message: "Please enter a valid email"
  });


  if (role === "seller") {

   if (!store) return res.status(400).json({ message: 'Store is required' })
  }

  next();
 } catch (error) {
  console.log(error);
  res.status(500).json({
   message: error.message || "Something went wrong"
  });
 }
}


export const checkExistingUser = async (req, res, next) => {
 try {
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: 'Role is required' })

  if (role === "seller") {
   const seller = await Seller.findById(req.userId).populate("roles");
   if (!seller) return res.status(404).json({ message: "Seller not found" });
  }
  if (role === "buyer") {
   const buyer = await Buyer.findById(req.userId);
   if (!buyer) return res.status(404).json({ message: "Buyer not found" });
  }

  next();
 } catch (error) {
  console.log(error);
  res.status(500).json({
   message: error.message || "Something went wrong"
  });
 }
}




