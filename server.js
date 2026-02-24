import express from 'express';
import cors from 'cors';
import db from './app/models/index.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', function (request, response) {
  response.send('<h2>Welcome to eatly-app!</h2>');
});

app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

const PORT = process.env.PORT;

// const Role = db.role;

db.sequelize
  .sync({ force: false })
  .then(() => {
    // initial();
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// function initial() {
//   Role.create({
//     id: 1,
//     name: 'user',
//   });

//   Role.create({
//     id: 2,
//     name: 'moderator',
//   });

//   Role.create({
//     id: 3,
//     name: 'admin',
//   });
// }

export default app;
