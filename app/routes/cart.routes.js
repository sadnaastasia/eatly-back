import express from 'express';
import {
  addToCart,
  deleteFromCart,
  getCart,
  mergeCarts,
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/getCart', getCart);
router.post('/add', addToCart);
router.post('/delete', deleteFromCart);
router.post('/mergeCarts', mergeCarts);

export default router;
