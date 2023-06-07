const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Expense =require("./expense")

const Expenseusers = sequelize.define("expenseusers", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
  isPremiumUser:Sequelize.BOOLEAN
});


module.exports = Expenseusers;
