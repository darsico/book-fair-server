// import Buyer from "../models/Buyer";

// export const buyerAuth = async (req, res, next) => {
//  if (!req.headers.authorization) {
//   return res.status(401).json({
//    message: "Unauthorized"
//   });
//  }
//  const token = req.headers.authorization.split(" ")[1];
//  const buyer = await Buyer.findOne({
//   token
//  });
//  if (!buyer) {
//   return res.status(401).json({
//    message: "Unauthorized"
//   });
//  }
//  req.buyer = buyer;
//  next();
// };
