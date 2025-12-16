import express from 'express';
import cors from 'cors';
import db from './app/models/index.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';
import 'dotenv/config';

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

const PORT = process.env.PORT;

const Role = db.role;

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default app;
