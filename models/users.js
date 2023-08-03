const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    required: true,
  },
  totalExpenses: {
    type: Number,
    required: true,
  },
  
});

module.exports = mongoose.model("User", userSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");
// const Expense =require("./expense")
// const { Model } = require('sequelize');
// // Import the Order model.
// const Order = require("../models/orders");

// // Define the User class.


// // Export the User class.


// const Expenseusers = sequelize.define("expenseusers", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   username: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   isPremiumUser:Sequelize.BOOLEAN,
//   totalExpenses: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0
//   }
// });


// // Define the getExpenses function as an instance method



// module.exports = Expenseusers;
