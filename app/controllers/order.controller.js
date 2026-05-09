import db from '../models/index.js';
import jwt from 'jsonwebtoken';

const { cartItem: CartItem, cart: Cart, order: Order } = db;

export const addOrder = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, authConfig.access_secret);

    const { totalPrice } = req.body

    const cart = await Cart.findOne({ where: { userId: decoded.id } });
    if (!cart) {
        res.status(200).json('Your cart is empty!');
      }

    const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
    });

    const order = await Order.create({userId: decoded.id, totalPrice: totalPrice})

    for (cartItem of cartItems) {
        await OrderItem.create({ orderId: order.id, dishId: cartItem.dishId, quantity: cartItem.quantity})
    }

    await cartItems.destroy();
    await cart.destroy();

    res.status(200).json('Order added successfully!');
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, authConfig.access_secret);

    const order = await Order.findOne({ where: { userId: decoded.id } });
    if (!order) {
         res.status(200).json('You do not have any order');
    }
    const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
      });
    res.status(200).json(orderItems);
  } catch {
    res.status(500).json({ message: error.message });
  }
};