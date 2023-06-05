const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expenseusers = sequelize.define("expenseusers", {
  id: {
    type: Sequelize.INTEGER,
    
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Expenseusers;
