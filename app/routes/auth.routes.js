import express from 'express';
import {
  signup,
  signin,
  refresh,
  logout,
} from '../controllers/auth.controller.js';
import {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} from '../middlewares/verifySignUp.js';

const router = express.Router();

router.post(
  '/signup',
  [checkDuplicateUsernameOrEmail, checkRolesExisted],
  signup,
);

router.post('/signin', signin);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;
