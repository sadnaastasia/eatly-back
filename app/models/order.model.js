export default (sequelize, Sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Accepted',
    },
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Order;
};
