import express from 'express';
import {
  addToCart,
  deleteFromCart,
  getCart,
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/getCart', getCart);
router.post('/add', addToCart);
router.post('/delete', deleteFromCart);

export default router;
