import express from 'express';
import { getAllDishes, getDishById } from '../controllers/menu.controller.js';

const router = express.Router();

router.get('/all', getAllDishes);
router.get('/dishById/:id', getDishById);

export default router;
