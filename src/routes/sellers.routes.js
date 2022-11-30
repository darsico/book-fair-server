import { Router } from "express";
import * as sellersCtrl from "../controllers/sellers.controller";

const router = Router()

router.get('/books', sellersCtrl.getAllBooks)
router.get('/', sellersCtrl.getAllSellers)
router.get('/:sellerId', sellersCtrl.getSellerById)
router.get('/:sellerId/books', sellersCtrl.getSellerBooks)
// router.get('/books/:title', sellersCtrl.getBookByTitle)
export default router;
