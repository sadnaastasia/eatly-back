import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const { user: User, role: Role, cart: Cart, cartItem: CartItem } = db;

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

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');

  user.reset_token = token;
  user.reset_token_expire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: authConfig.email,
      pass: authConfig.email_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const resetLink = `${process.env.ORIGIN}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `<${authConfig.email}>`,
    to: user.email,
    subject: 'Reset password',
    html: `
      <h3>Reset password</h3>
      <p>Click the Link bellow:</p>
      <a referrerpolicy="no-referrer" href="${resetLink}">${resetLink}</a>
    `,
  });

  res.json({ message: 'Email sent' });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({ where: { reset_token: token } });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ message: 'Token expired' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpire = null;

  await user.save();

  res.json({ message: 'Password updated successfully' });
};
