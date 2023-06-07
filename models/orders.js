const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User=require("../models/users");
const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentId: {
    type: Sequelize.STRING,
  },
  orderId: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});


module.exports = Order;
