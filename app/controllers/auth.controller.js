import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config.js';

const { user: User, role: Role } = db;

export const signup = async (req, res) => {
  console.log('BODY:', req.body);
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const userRole = await Role.findOne({ where: { name: 'user' } });

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await user.setRoles([userRole]);

    res.status(201).json('Successful registration!');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: { model: Role, as: 'roles' },
    });

    if (!user) {
      return res.status(404).json({ message: 'User is not found.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }

    const accessToken = jwt.sign({ id: user.id }, authConfig.access_secret, {
      expiresIn: authConfig.access_jwtExpiration,
    });

    const refreshToken = jwt.sign({ id: user.id }, authConfig.refresh_secret, {
      expiresIn: authConfig.refresh_secret_jwtExpiration,
    });

    await User.update(
      { refresh_token: refreshToken },
      {
        where: { id: user.id },
        include: { model: Role, as: 'roles' },
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, authConfig.refresh_secret);

    const user = await User.findOne({
      where: { id: decoded.id },
      include: { model: Role, as: 'roles' },
    });

    if (!user) return res.sendStatus(403);

    const accessToken = jwt.sign({ id: user.id }, authConfig.access_secret, {
      expiresIn: authConfig.access_jwtExpiration,
    });

    res.json({ accessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const decoded = jwt.verify(token, authConfig.refresh_secret);

    await User.update(
      { refresh_token: null },
      {
        where: { id: decoded.id },
        include: { model: Role, as: 'roles' },
      },
    );
  } catch {}

  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};
