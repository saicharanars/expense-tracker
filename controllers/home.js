const { error, Console } = require("console");
const path = require("path");
const rootDir = path.dirname(process.mainModule.filename);
const Expense = require("../models/expense");
const User = require("../models/users");

exports.getExpense = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "index.html"));
};
exports.postExpense = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    const expenseamount = req.body.expenseamount;
    const category = req.body.category;
    const expensetype = req.body.expensetype;

    const userId = req.user.userid;
    console.log(userId);
    const data = await Expense.create({
      expenseamount: expenseamount,
      category: category,
      expensetype: expensetype,
      expenseuserId:userId
      
    });

    res.status(200).json({ expenses: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.getData = async (req, res, next) => {
  try {
    const data = await Expense.findAll();
    res.status(200).json({ expenses: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.postDelete = async (req, res, next) => {
  try {
    const userId = req.user.userid;
    console.log(userId);

    if (!req.params.id) {
      console.log("ID IS MISSING");
      return res.status(400).json({ err: "ID is missing" });
    }
    
    const uId = req.params.id;
    const owner = await Expense.findOne({ where: { id: uId,expenseuserId:userId } });
    owner.destroy();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getUserLeaderBoard = async (req, res,next) => {
  try {
      const [users, expenses] = await Promise.all([User.findAll(), Expense.findAll()]);
      console.log(users);
      const userAggregatedExpenses = expenses.reduce((acc, expense) => {
          acc[expense.expenseuserId] = (acc[expense.expenseuserId] || 0) + expense.expenseamount;
          return acc;
      }, {});

      const userLeaderBoardDetails = users.map(user => ({
          name: user.username,
          total_cost: userAggregatedExpenses[user.id] || 0,
      }));

      userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
      console.log(userLeaderBoardDetails);

      res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
}