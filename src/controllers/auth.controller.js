import Buyer from '../models/Buyer';
import Seller from '../models/Seller';
import jwt from 'jsonwebtoken';
import config from '../config';
import { validateEmail } from '../utils/validateEmail';
import Role from '../models/Role';

export const loginUser = async (req, res) => {
 try {
  const { email, password, role } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') res.status(400).json({ message: 'Invalid data' })
  if (!email) res.status(400).json({ message: 'Please fill the email field' });
  if (!password) res.status(400).json({ message: 'Please fill the password field' });
  if (!role) res.status(400).json({ message: 'Please fill the role field' });

  const incomingRole = role.toLowerCase();
  if (incomingRole !== 'buyer' && incomingRole !== 'seller') res.status(400).json({ message: 'The role sent is incorrect' });

  if (!validateEmail(email)) res.status(400).json({ message: 'Please enter a valid email' });

  if (role === 'buyer') {
   const buyer = await Buyer.findOne({ email }).select('+password');

   if (!buyer) res.status(400).json({ message: 'Buyer not found' });

   const matchPassword = await Buyer.comparePassword(password, buyer.password);

   if (!matchPassword) res.status(401).json({ token: null, message: 'Invalid password' });

   const token = jwt.sign({ id: buyer._id }, config.secret, {
    expiresIn: 86400,
   });

   res.status(200).json({ token, buyer });
  }

  if (role === 'seller') {
   const seller = await Seller.findOne({ email }).populate('roles').select('+password');

   if (!seller) res.status(400).json({ message: 'Seller not found' });

   const matchPassword = await Seller.comparePassword(password, seller.password);

   if (!matchPassword) res.status(401).json({ token: null, message: 'Invalid password' });

   const token = jwt.sign({ id: seller._id }, config.secret, {
    expiresIn: 86400,
   });

   res.status(200).json({ token, seller });
  }
 } catch (error) {
  console.log(error);

  res.status(500).json({ message: error.message || 'Something went wrong' });
 }
};

export const createNewUser = async (req, res) => {
 try {
  const { name, email = false, password, role, store } = req.body;
  if (!email) res.status(400).json({ message: 'Please fill the email field' });
  if (!password) res.status(400).json({ message: 'Please fill the password field' });
  if (!role) res.status(400).json({ message: 'Please fill the role field' });
  if (!name) res.status(400).json({ message: 'Please fill the name field' });
  if (!store) res.status(400).json({ message: 'Please fill the store field' });

  if (typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string', typeof store !== 'string', typeof name !== 'string') res.status(400).json({ message: 'Invalid data' })

  const incomingRole = role.toLowerCase();

  if (incomingRole !== 'buyer' && incomingRole !== 'seller') res.status(400).json({ message: 'The role sent is incorrect' });

  if (role === 'seller') {
   const seller = await Seller.findOne({
    email,
   });

   if (seller) return res.status(400).json({ message: 'Seller already exists' });

   const newSeller = new Seller({
    name,
    email,
    password: await Seller.encryptPassword(password),
    store,
   });

   const role = await Role.findOne({
    name: 'seller',
   });

   newSeller.roles = [role._id];

   const savedSeller = await newSeller.save();

   const token = jwt.sign({ id: savedSeller._id }, config.secret, {
    expiresIn: 86400, // 24 hours
   });
   res.status(200).json({
    newSeller,
    token,
   });
  }

  if (role === 'buyer') {
   const buyer = await Buyer.findOne({
    email,
   });

   if (buyer) return res.status(400).json({ message: 'Buyer already exists' });

   const newBuyer = new Buyer({
    name,
    email,
    password: await Buyer.encryptPassword(password),
   });

   const role = await Role.findOne({
    name: 'buyer',
   });

   newBuyer.roles = [role._id];

   const savedBuyer = await newBuyer.save();

   const token = jwt.sign({ id: savedBuyer._id }, config.secret, {
    expiresIn: 86400, // 24 hours
   });
   res.status(200).json({
    newBuyer,
    token,
   });
  }
 } catch (error) {
  console.log(error);
  return res.status(500).json({
   message: 'Something goes wrong',
  });
 }
};
