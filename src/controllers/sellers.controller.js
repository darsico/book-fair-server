import Book from "../models/Book";
import Seller from "../models/Seller";

export const getAllSellers = async (req, res) => {
 const { store } = req.query;

 const condition = store ?
  {
   store: {
    $regex: new RegExp(store),
    $options: "i"
   }
  } : {};

 const sellers = await Seller.find(condition).populate("books");

 if (!sellers) return res.status(400).json({ message: "No sellers found" })

 res.status(200).json({
  message: "Sellers found",
  sellers
 });
}

//get seller by id but not orders 
export const getSellerById = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);

 if (!seller) return res.status(400).json({ message: "Seller not found" })

 res.status(200).json({
  message: "Seller found",
  seller: {
   sellerName: seller.name,
   sellerEmail: seller.email,
   sellerStore: seller.store
  },

 });
}

// get seller books 
export const getSellerBooks = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);
 if (!seller) return res.status(400).json({ message: "Seller not found" })

 const books = await Book.find({ seller: seller._id });
 if (!books) return res.status(400).json({ message: "Seller has no books" })

 res.status(200).json({
  message: "Seller books found",
  books
 });
}
//get all books and search by title optional
export const getAllBooks = async (req, res) => {
 try {

  const { title = false } = req.query;
  const condition = title ? {
   title: {
    $regex: new RegExp(req.query.title),
    $options: "i"
   }
  } : {};

  const books = await Book.find(condition
  ).populate("seller", "name store");

  if (!books) return res.status(400).json({ message: "No books found" })

  res.status(200).json({
   message: "Books found",
   books
  })
 } catch (error) {
  res.status(500).json({
   message: error.message || "Something went wrong retrieving the books"
  });
 }
}
