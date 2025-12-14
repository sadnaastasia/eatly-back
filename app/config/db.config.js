import 'dotenv/config';

export default {
  HOST: process.env.APP_HOST,
  USER: process.env.APP_USER,
  PASSWORD: process.env.APP_PASSWORD,
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  dialect: process.env.APP_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
