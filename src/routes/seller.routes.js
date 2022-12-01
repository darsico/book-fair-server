import { Router } from "express";
import * as sellerCtrl from "../controllers/seller.controller";
import * as authJwt from "../middlewares/authJwt";


const router = Router()

router.get('/:sellerId', [authJwt.verifySellerToken, authJwt.isSeller], sellerCtrl.getSellerById)
router.post('/:sellerId/books/new', [authJwt.verifySellerToken, authJwt.isSeller], sellerCtrl.newSellerBook)
router.get('/:sellerId/books', sellerCtrl.getSellerBooks)
router.put('/:sellerId/books/:bookId', [authJwt.verifySellerToken, authJwt.isSeller], sellerCtrl.updateSellerBook)
router.delete('/:sellerId/books/:bookId', [authJwt.verifySellerToken, authJwt.isSeller], sellerCtrl.deleteSellerBook)


router.delete('/deletebooks', sellerCtrl.deleteAllBooks)
router.delete('/deletesellers', sellerCtrl.deleteAllSellers)
export default router;
