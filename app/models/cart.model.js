export default (sequelize, Sequelize) => {
  const Cart = sequelize.define('cart', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  return Cart;
};
