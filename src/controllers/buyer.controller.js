import Buyer from "../models/Buyer";
import Order from "../models/Order";
import Book from "../models/Book";
import Seller from "../models/Seller";

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
          message: `${book.title} is out of stock, you can only buy ${book.stock} books`
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
  try {
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

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong"
    });
  }
};

export const updateBuyerById = async (req, res) => {
  try {
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
  } catch {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong"
    });

  }
}

export const getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.status(200).json({
      message: "Buyers found",
      buyers
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong"
    });

  }
}

export const deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany();
    res.status(200).json({
      message: "Orders deleted"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong"
    });
  }
}


export const deleteAllBuyers = async (req, res) => {

  try {
    await Buyer.deleteMany();
    res.status(200).json({
      message: "Buyers deleted"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong"
    });

  }
}