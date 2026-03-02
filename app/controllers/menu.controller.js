import db from '../models/index.js';

const { dish: Dish } = db;

export const getAllDishes = async (req, res) => {
  try {
    const allDishes = await Dish.findAll();
    res.status(200).json({
      allDishes: allDishes,
    });
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getDishById = async (req, res) => {
  try {
    const id = req.params.id;
    const dish = await Dish.findByPk(id);
    res.status(200).json({
      dish: dish,
    });
  } catch {
    res.status(500).json({ message: error.message });
  }
};
