import Book from "../models/Book";
import Seller from "../models/Seller";
import Order from "../models/Order";
export const getSellerById = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId).populate("books").populate("orders", {
  books: {
   quantity: 1
  },
 }).populate({
  path: "orders",
  populate: {
   path: "books.book",
   model: "Book",
  }
 }).populate({
  path: "orders",
  populate: {
   path: "buyer",
   model: "Buyer",
   select: {
    name: 1,
    email: 1
   }
  }
 })

 const sellerOrders = await Order.find({
  seller: req.params.sellerId,
 }).populate({
  path: "books",
  populate: {
   path: "book",
   model: "Book",
  }
 }).populate("buyer", {
  name: 1,
  email: 1,
 });

 res.status(200).json({
  message: "Seller found",
  seller,
  sellerOrders: sellerOrders?.reverse(),
 });
}

export const getSellerBooks = async (req, res) => {
 if (!req.params.sellerId) {
  return res.status(400).json({
   message: "Seller id is required"
  });
 }
 const seller = await Seller.findById(req.params.sellerId);
 const books = await Book.find({ seller: seller._id }).select("-seller");
 const reversedBooks = books.reverse();
 res.status(200).json({
  message: "Seller books found",
  seller,
  books: reversedBooks
 });
}

export const newSellerBook = async (req, res) => {
 console.log(req.body);
 try {
  if (!req.params.sellerId) {
   return res.status(400).json({
    message: "Seller id is required"
   });
  }
  const seller = await Seller.findById(req.params.sellerId);
  const { title = false, description = false, price = false, image, stock = false, author } = req.body;
  console.log(req.body);
  if (!author) {
   return res.status(400).json({
    message: "Author is required"
   });
  }
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

  const doesBookExist = await Book.findOne({ title, seller: seller._id });

  if (doesBookExist) {
   return res.status(400).json({
    message: "Book already exists in your store, please update it"
   });
  }

  const newBook = new Book({
   title, description, price, seller: seller._id, image, stock, author
  });
  const bookSaved = await newBook.save();

  seller.books = [...seller.books, bookSaved._id];
  await seller.save();

  res.status(201).json({
   message: "Book created",
   bookSaved
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({
   message: "Something went wrong"
  });
 }
}

export const updateSellerBook = async (req, res) => {
 try {
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
 } catch {
  console.error(error);
  res.status(500).json({
   message: "Something went wrong"
  });

 }
}

export const deleteSellerBook = async (req, res) => {
 try {
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
 } catch (error) {
  console.error(error);
  res.status(500).json({
   message: error.message || "Something went wrong"
  });
 }
}


export const deleteAllBooks = async (req, res) => {
 try {
  const books = await Book.deleteMany({});
  res.status(200).json({
   message: "Books deleted",
   books
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({
   message: error.message || "Something went wrong"
  });
 }
}

export const deleteAllSellers = async (req, res) => {
 try {
  await Seller.deleteMany();
  res.status(200).json({
   message: "All sellers deleted"
  });
 } catch (error) {
  res.status(500).json({
   message: error.message || "Something went wrong"
  });
 }
}