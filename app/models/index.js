import Sequelize from 'sequelize';
import mysql2 from 'mysql2';
import dbConfig from '../config/db.config.js';
import userModel from './user.model.js';
import roleModel from './role.model.js';
import dishModel from './dish.model.js';
import cartModel from './cart.model.js';
import cartItemModel from './cartItem.model.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
  pool: dbConfig.pool,
  port: dbConfig.PORT,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);
db.dish = dishModel(sequelize, Sequelize);
db.cart = cartModel(sequelize, Sequelize);
db.cartItem = cartItemModel(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: 'user_roles',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  as: 'roles',
});

db.cart.belongsTo(db.user);
db.user.hasOne(db.cart);

db.cartItem.belongsTo(db.cart);
db.cart.hasMany(db.cartItem);

db.cartItem.belongsTo(db.dish);
db.dish.hasMany(db.cartItem);

db.ROLES = ['user', 'admin', 'moderator'];

export default db;
