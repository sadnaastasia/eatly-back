export default (sequelize, Sequelize) => {
  const CartItem = sequelize.define('cartItem', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    cartId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    dishId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return CartItem;
};
