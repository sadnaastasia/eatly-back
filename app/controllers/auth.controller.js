import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config.js';

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

    await mergeCarts(req, res, user.id);

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: false,
    auth: {
      user: authConfig.email,
      pass: authConfig.email_password,
    },
  });

  const resetLink = `http://localhost:4200/reset-password?token=${token}`;

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

  const user = users.find((u) => u.resetToken === token);

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ message: 'Token expired' });
  }

  const hashed = await bcrypt.hash(password, 10);

  user.password = hashed;
  user.resetToken = null;
  user.resetTokenExpire = null;

  res.json({ message: 'Password updated successfully' });
};

async function mergeCarts(req, res, userId) {
  const guestId = req.cookies?.guestId;

  if (!guestId) return;

  const guestCart = await Cart.findOne({ where: { guestId } });
  if (!guestCart) return;

  const userCart = await Cart.findOne({ where: { userId } });

  if (!userCart) {
    guestCart.userId = userId;
    guestCart.guestId = null;

    await guestCart.save();
    res.clearCookie('guestId');
    return;
  }

  const guestCartItems = await CartItem.findAll({
    where: { cartId: guestCart.id },
  });

  const userCartItems = await CartItem.findAll({
    where: { cartId: userCart.id },
  });

  for (const guestItem of guestCartItems) {
    const existing = userCartItems.find(
      (item) => item.dishId === guestItem.dishId,
    );

    if (existing) {
      existing.quantity += guestItem.quantity;
      await existing.save();
    } else {
      await CartItem.create({
        cartId: userCart.id,
        dishId: guestItem.dishId,
        quantity: guestItem.quantity,
      });
    }
  }
  await Promise.all(guestCartItems.map((item) => item.destroy()));
  await guestCart.destroy();
  res.clearCookie('guestId');
}
