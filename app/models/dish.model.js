export default (sequelize, Sequelize) => {
  const Dish = sequelize.define('dish', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cooking_time: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Dish;
};
