import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js';

const { cartItem: CartItem } = db;

export const addToCart = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, authConfig.access_secret);

    const cartItem = await CartItem.create();
    res.status(200).json(allDishes);
  } catch {
    res.status(500).json({ message: error.message });
  }
};
