const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  expenseamount: {
    type: Number,
    required: true,
  },
  expensetype: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("expense", expenseSchema);

