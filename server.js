import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import db from './app/models/index.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';
import menuRoutes from './app/routes/menu.routes.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};

app.use('/media', express.static(path.join(__dirname, 'media')));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.disable('x-powered-by');

app.get('/', function (request, response) {
  response.send('<h2>Welcome to eatly-app!</h2>');
});

app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);
app.use('/api/menu', menuRoutes);

const PORT = process.env.PORT;

const Role = db.role;
const Dish = db.dish;

db.sequelize
  .sync({ force: false })
  // .sync({ alter: true })
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

function initial() {
  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'moderator',
  });

  Role.create({
    id: 3,
    name: 'admin',
  });

  Dish.create({
    name: 'The Chicken King',
    picture: 'http://localhost:8080/media/thechickenking.svg',
    label: 'Trending',
    description:
      'The Chicken King is a bold, flavor-packed masterpiece made for true chicken lovers. A juicy, tender chicken fillet—crispy on the outside and succulent on the inside—is crowned with fresh, crunchy lettuce, ripe tomatoes, and melted cheese, all embraced by a soft, toasted bun. Finished with a signature house sauce that blends creamy, smoky, and slightly tangy notes, every bite delivers the perfect balance of crunch, heat, and richness. Big on taste. Big on satisfaction.',
    price: 15.99,
    cooking_time: 45,
    rating: 4.9,
  });

  Dish.create({
    name: 'Chicken Hell',
    picture: 'http://localhost:8080/media/chickenhell.svg',
    label: 'Healthy',
    description:
      'Tender chicken pieces tossed in a blazing hot chili sauce with garlic, smoked paprika, and crushed red peppers. Finished with fresh herbs and a fiery glaze that delivers intense heat with every bite. Not for the faint-hearted.',
    price: 12.99,
    cooking_time: 24,
    rating: 4.8,
  });

  Dish.create({
    name: 'Swe Dish',
    picture: 'http://localhost:8080/media/swedish.svg',
    label: 'Trending',
    description:
      'A delightful blend of tender ingredients glazed in a rich, sweet sauce with hints of honey and caramelized spices. Perfectly balanced flavors that create a comforting and satisfying experience in every bite.',
    price: 19.99,
    cooking_time: 34,
    rating: 4.9,
  });

  Dish.create({
    name: 'Fish Fresh',
    picture: 'http://localhost:8080/media/fishfresh.svg',
    label: 'Supreme',
    description:
      'Tender, flaky fish cooked to perfection and finished with a splash of citrus and a drizzle of olive oil. Pure freshness, beautifully balanced.',
    price: 19.99,
    cooking_time: 34,
    rating: 4.9,
  });
}

export default app;
