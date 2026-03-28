import db from '../models/index.js';

const { ROLES, user: User } = db;

export const checkDuplicateUsername = async (username) => {
  if (!username) return;
  const userByUsername = await User.findOne({
    where: { username: username },
  });
  if (userByUsername) {
    throw new Error('Username is already in use!');
  }
};

export const checkDuplicateEmail = async (email) => {
  if (!email) return;
  const userByEmail = await User.findOne({
    where: { email: email },
  });
  if (userByEmail) {
    throw new Error('Email is already in use!');
  }
};

export const checkUsername = async (req, res) => {
  const { username } = req.body;

  const exists = await User.findOne({ where: { username: username } });

  res.json({
    available: !exists,
  });
};
