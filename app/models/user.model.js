export default (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return User;
};
