export default (sequelize, Sequelize) => {
  const CartItem = sequelize.define('cartItem', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    guestId: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  });

  return CartItem;
};
