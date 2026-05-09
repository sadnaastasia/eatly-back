import express from 'express';
import {
  addToCart,
  deleteFromCart,
  getCart,
  mergeCarts,
  getCartPrice
} from '../controllers/cart.controller.js';
import { verifyToken} from '../middlewares/authJwt.js';

const router = express.Router();

router.get('/getCart', [verifyToken], getCart);
router.post('/getCartPrice', [verifyToken], getCartPrice);
router.post('/add', [verifyToken], addToCart);
router.post('/delete', [verifyToken], deleteFromCart);
router.post('/mergeCarts', [verifyToken], mergeCarts);

export default router;
