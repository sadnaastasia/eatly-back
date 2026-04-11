export default (sequelize, Sequelize) => {
  const Cart = sequelize.define('cart', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    guestId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
  });

  return Cart;
};
