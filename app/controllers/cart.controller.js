import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js';

const { cartItem: CartItem, cart: Cart } = db;

export const getCart = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      const decoded = jwt.verify(token, authConfig.access_secret);
      let cart = await Cart.findOne({ where: { userId: decoded.id } });
      if (!cart) {
        cart = await Cart.create({ userId: decoded.id });
      }
      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
      });
      res.status(200).json(cartItems);
    } else {
      const guestId = req.headers['x-guest-id'];
      let cart = await Cart.findOne({ where: { guestId } });
      if (!cart) {
        cart = await Cart.create({ guestId });
      }
      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
      });
      res.status(200).json(cartItems);
    }
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const { dishId } = req.body;
    if (token) {
      const decoded = jwt.verify(token, authConfig.access_secret);
      let cart = await Cart.findOne({ where: { userId: decoded.id } });
      if (!cart) {
        cart = await Cart.create({ userId: decoded.id });
      }
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, dishId },
      });
      if (cartItem) {
        await cartItem.increment('quantity', { by: 1 });
      } else {
        await CartItem.create({
          cartId: cart.id,
          dishId,
        });
      }
    } else {
      const guestId = req.headers['x-guest-id'];
      let cart = await Cart.findOne({ where: { guestId } });
      if (!cart) {
        cart = await Cart.create({ guestId });
      }
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, dishId },
      });
      if (cartItem) {
        await cartItem.increment('quantity', { by: 1 });
      } else {
        await CartItem.create({
          dishId,
          cartId: cart.id,
        });
      }
    }
    res.status(200).json('Dish added successfully!');
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const { dishId } = req.body;
    if (token) {
      const decoded = jwt.verify(token, authConfig.access_secret);
      const cart = await Cart.findOne({ where: { userId: decoded.id } });
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, dishId },
      });
      if (cartItem.quantity > 1) {
        await cartItem.decrement('quantity', { by: 1 });
      } else {
        await cartItem.destroy();
      }
    } else {
      const guestId = req.headers['x-guest-id'];
      const cart = await Cart.findOne({ where: { guestId } });
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, dishId },
      });
      if (cartItem.quantity > 1) {
        await cartItem.decrement('quantity', { by: 1 });
      } else {
        await cartItem.destroy();
      }
    }
    res.status(200).json('Dish deleted successfully!');
  } catch {
    res.status(500).json({ message: error.message });
  }
};
