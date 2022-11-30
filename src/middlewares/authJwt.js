import jwt from 'jsonwebtoken';
import config from '../config';
import Seller from '../models/Seller.js';
import Buyer from '../models/Buyer.js';
import Role from '../models/Role.js';

export const verifySellerToken = async (req, res, next) => {
 try {
  let token = req.headers['x-access-token'];

  if (!token) {
   return res.status(403).send({
    message: 'No token provided!'
   });
  }
  const decoded = jwt.verify(token, config.secret);
  req.sellerId = decoded.id;
  const seller = await Seller.findById(req.sellerId, {
   password: 0
  })
  if (!seller) {
   return res.status(404).send({
    message: 'No seller found!'
   });
  }
  next();
 } catch (error) {
  return res.status(401).send({
   message: 'Unauthorized!'
  });
 }
};

export const verifyBuyerToken = async (req, res, next) => {
 try {
  const token = req.headers['x-access-token'];

  if (!token) {
   return res.status(403).send({
    message: 'No token provided!'
   });
  }
  const decoded = jwt.verify(token, config.secret);
  req.buyerId = decoded.id;
  const buyer = await Buyer.findById(req.buyerId, {
   password: 0
  })

  if (!buyer) {
   return res.status(404).send({
    message: 'No buyer found!'
   });
  }
  next();
 } catch (error) {
  return res.status(401).send({
   message: 'Unauthorized!'
  });
 }
};


export const isSeller = async (req, res, next) => {
 try {
  const seller = await Seller.findById(req.sellerId)
  const roles = await Role.find({
   _id: {
    $in: seller.roles
   }
  });
  for (let i = 0; i < roles.length; i++) {
   if (roles[i].name === 'seller') {
    next();
    return;
   }
  }
  return res.status(403).send({
   message: 'Require Seller Role!'
  });
 } catch (error) {
  return res.status(500).send({
   message: error
  });
 }
};


export const isBuyer = async (req, res, next) => {
 try {
  const buyer = await Buyer.findById
   (req.buyerId)
  const roles = await Role.find({
   _id: {
    $in: buyer.roles
   }
  });
  for (let i = 0; i < roles.length; i++) {
   if (roles[i].name === 'buyer') {
    next();
    return;
   }
  }
  return res.status(403).send({
   message: 'Require Buyer Role!'
  });
 } catch (error) {
  return res.status(500).send({
   message: error
  });
 }
};
