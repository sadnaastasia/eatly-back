import 'dotenv/config';

export default {
  secret: process.env.AUTH_SECRET,
  jwtExpiration: process.env.AUTH_SECRET_EXPIRES_IN,
};
