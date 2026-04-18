import 'dotenv/config';

export default {
  access_secret: process.env.ACCESS_SECRET,
  access_jwtExpiration: process.env.ACCESS_SECRET_EXPIRES_IN,
  refresh_secret: process.env.REFRESH_SECRET,
  refresh_secret_jwtExpiration: process.env.REFRESH_SECRET_EXPIRES_IN,
  email: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
};
