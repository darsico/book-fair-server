import Buyer from "../models/Buyer";
import Order from "../models/Order";
import Book from "../models/Book";
import Seller from "../models/Seller";

import { validateEmail } from "../utils/validateEmail";

export const createOrder = async (req, res) => {
 try {
  const { sellerId = false, books = false, buyerId = false } = req.body;

  if (!buyerId) {
   return res.status(400).json({
    message: "Buyer id is required"
   });
  }
  if (!sellerId) {
   return res.status(400).json({
    message: "Seller id is required"
   });
  }
  if (!books) {
   return res.status(400).json({
    message: "Books are required"
   });
  }

  const buyer = await Buyer.findById
   (buyerId);
  const seller = await Seller.findById
   (sellerId);

  if (!buyer) {
   return res.status(400).json({
    message: "Buyer not found"
   });
  }
  if (!seller) {
   return res.status(400).json({
    message: "Seller not found"
   });
  }

  let total = 0;

  // check if books are available and update stock
  for (let i = 0; i < books.length; i++) {
   const book
    = await Book.findById
     (books[i].bookId);
   if (!book) {
    return res.status(400).json({
     message: "Book not found"
    });
   }
   if (book.stock < books[i].quantity) {
    return res.status(400).json({
     message: "Book not available"
    });
   }
   book.stock = book.stock - books[i].quantity;
   await book.save();
   total = total + (book.price * books[i].quantity);
  }

  const booksToOrder = books.map(book => book.bookId)

  const newOrder = new Order({
   books: booksToOrder,
   buyer: buyer._id,
   seller: seller._id,
   total,
  });

  seller.orders = [...seller.orders, newOrder._id];
  buyer.orders = [...buyer.orders, newOrder._id];

  await newOrder.save();
  await buyer.save()
  await seller.save();

  res.status(200).json({
   message: "Order created",
   order: newOrder
  });
 } catch (error) {
  console.log(error);
  res.status(500).json({
   message: "Something went wrong"
  });
 }
};


export const createBuyer = async (req, res) => {
 const { name = false, email = false } = req.body;

 if (!name) {
  return res.status(400).json({
   message: "Name is required"
  });
 }
 if (!email) {
  return res.status(400).json({
   message: "Email is required"
  });

 }
 if (email && !validateEmail(email)) {
  return res.status(400).json({
   message: "Email is not valid"
  });
 }
 const newBuyer = new Buyer({
  name, email
 });
 const buyerSaved = await newBuyer.save();
 res.status(201).json({
  message: "Buyer created",
  buyerSaved
 });
};

export const loginBuyer = async (req, res) => {
 const { email = false } = req.body;
 if (!email) {
  return res.status(400).json({
   message: "Email is required"
  });
 }
 const buyer = await Buyer.findOne({
  email
 });
 if (!buyer) {
  return res.status(400).json({
   message: "Buyer not found"
  });
 }
 res.status(200).json({
  message: "Buyer found",
  buyer
 });
};

// export const logoutBuyer = async (req, res) => {
//  const { email = false } = req.body;
//  if (!email) {
//   return res.status(400).json({
//    message: "Email is required"
//   });
//  }
//  const buyer = await Buyer.findOne({
//   email
//  });
//  if (!buyer) {
//   return res.status(400).json({
//    message: "Buyer not found"
//   });
//  }
//  res.status(200).json({
//   message: "Buyer found",
//   buyer
//  });
// };

//get buyer by info and orders
export const getBuyerById = async (req, res) => {
 const { buyerId = false } = req.params;

 if (!buyerId) {
  return res.status(400).json({
   message: "Id is required"
  });
 }

 const buyer = await Buyer.findById(buyerId).populate("orders");

 res.status(200).json({
  message: "Buyer found",
  buyer
 });
};

// export const getBuyerById = async (req, res) => {
//  if (!req.params.buyerId) {
//   return res.status(400).json({
//    message: "Id is required"
//   });
//  }
//  const buyer = await Buyer.findById(req.params.buyerId);
//  const orders = await Order.find({ buyer: buyer._id });

//  res.status(200).json({
//   message: "Buyer found",
//   buyer
//  });
// }

export const updateBuyerById = async (req, res) => {
 const { buyerId = false } = req.params;
 if (!buyerId) {
  res.status(400).json({
   message: "Buyer id is required"
  });
 }
 const updated = await Buyer.findByIdAndUpdate(buyerId, req
  .body, {
  new: true
 });
 res.status(200).json({
  message: "Buyer updated",
  updated
 });
}

export const getAllBuyers = async (req, res) => {
 const buyers = await Buyer.find();
 res.status(200).json({
  message: "Buyers found",
  buyers
 });
}
