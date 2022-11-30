import { Router } from "express";
import * as sellerCtrl from "../controllers/seller.controller";

const router = Router()

router.post('/new', sellerCtrl.createSeller)
router.post('/login', sellerCtrl.loginSeller)
router.get('/:sellerId', sellerCtrl.getSellerById)
router.post('/:sellerId/books/new', sellerCtrl.newSellerBook)
router.get('/:sellerId/books', sellerCtrl.getSellerBooks)
router.put('/:sellerId/books/:bookId', sellerCtrl.updateSellerBook)
router.delete('/:sellerId/books/:bookId', sellerCtrl.deleteSellerBook)

export default router;
