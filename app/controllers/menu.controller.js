import db from '../models/index.js';
import { Op } from 'sequelize';

const { dish: Dish } = db;

export const getAllDishes = async (req, res) => {
  try {
    const allDishes = await Dish.findAll();
    res.status(200).json(allDishes);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getDishById = async (req, res) => {
  try {
    const id = req.params.id;
    const dish = await Dish.findByPk(id);
    res.status(200).json(dish);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const filterDishes = async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase().trim() || '';

    if (!query) {
      return res.status(200).json([]);
    }

    const result = await Dish.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
