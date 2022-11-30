import { Router } from "express";
import * as buyerCtrl from "../controllers/buyer.controller";

const router = Router()

router.get('/', buyerCtrl.getAllBuyers)
router.post('/new', buyerCtrl.createBuyer)
router.post('/login', buyerCtrl.loginBuyer)
router.post('/order', buyerCtrl.createOrder)
router.get('/:buyerId', buyerCtrl.getBuyerById)
router.put('/:buyerId', buyerCtrl.updateBuyerById)

export default router;