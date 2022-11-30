import Book from "../models/Book";
import Seller from "../models/Seller";

export const createSeller = async (req, res) => {
 const { name = false, email = false, store = false } = req.body;
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
 if (!store) {
  return res.status(400).json({
   message: "Store is required"
  });
 }

 const newSeller = new Seller({
  name, email, store
 });
 const sellerSaved = await newSeller.save();
 res.status(201).json({
  message: "Seller created",
  sellerSaved
 });
}

export const loginSeller = async (req, res) => {
 const { email } = req.body;
 const seller = await Seller
  .findOne
  ({ email });
 if (!seller) {
  return res.status(400).json({
   message: "Seller not found"
  });
 }
 res.status(200).json({
  message: "Seller LOGGED IN",
  sellerId: seller._id
 });
}

export const getSellerById = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId).populate("books");
 res.status(200).json({
  message: "Seller found",
  seller
 });
}

export const getSellerBooks = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Seller id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);
 const books = await Book.find({ seller: seller._id });
 res.status(200).json({
  message: "Seller books found",
  books
 });
}

export const newSellerBook = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Seller id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);
 const { title = false, description = false, price = false, image, stock = false } = req.body;
 if (!stock) {
  return res.status(400).json({
   message: "Stock is required"
  });
 }
 if (!title) {
  return res.status(400).json({
   message: "title is required"
  });
 }
 if (!description) {
  return res.status(400).json({
   message: "Description is required"
  });
 }
 if (!price) {
  return res.status(400).json({
   message: "Price is required"
  });
 }


 const newBook = new Book({
  title, description, price, seller: seller._id, image, stock
 });
 const bookSaved = await newBook.save();

 seller.books = [...seller.books, bookSaved._id];
 await seller.save();

 res.status(201).json({
  message: "Book created",
  bookSaved
 });
}

export const updateSellerBook = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Seller id is required"
  });
 }
 if (!req.params.bookId) {
  return res.status(400).json({
   message: "Book id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);
 const book = await Book.findById(req.params.bookId);
 if (book.seller.toString() !== seller._id.toString()) {
  return res.status(400).json({
   message: "Seller does not own this book"
  });
 }
 const { title, description, price, stock } = req.body;
 const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, {
  title, description, price, stock
 }, { new: true });
 res.status(200).json({
  message: "Book updated",
  updatedBook
 });
}

export const deleteSellerBook = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Seller id is required"
  });
 }
 if (!req.params.bookId) {
  return res.status(400).json({
   message: "Book id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);
 const book = await Book.findById(req.params.bookId);
 if (book.seller.toString() !== seller._id.toString()) {
  return res.status(400).json({
   message: "Seller does not own this book"
  });
 }
 const deletedBook = await Book.findByIdAndDelete(req.params.bookId);
 res.status(200).json({
  message: "Book deleted",
  deletedBook
 });
}
