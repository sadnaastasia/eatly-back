import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  signup,
  signin,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import {
  checkDuplicateEmail,
  checkDuplicateUsername,
  checkUsername,
} from '../middlewares/verifySignUp.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .bail()
      .isEmail()
      .withMessage('Invalid email format')
      .bail()
      .custom(checkDuplicateEmail),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .bail()
      .isLength({ min: 5 })
      .withMessage('Username must be at least 5 characters long')
      .bail()
      .custom(checkDuplicateUsername),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  signup,
);

router.post('/check-username', checkUsername);

router.post('/signin', signin);

router.post('/refresh', refresh);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
