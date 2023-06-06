const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const expenseUser=require("./users");

const Expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  expenseamount:{
    type:Sequelize.INTEGER,
    allowNull:false,
  } ,

  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  expensetype: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});



module.exports = Expense;
