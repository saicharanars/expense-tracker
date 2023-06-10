const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Expense =require("./expense")
const { Model } = require('sequelize');


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
  isPremiumUser:Sequelize.BOOLEAN,
  totalExpenses: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});


// Define the getExpenses function as an instance method



module.exports = Expenseusers;
