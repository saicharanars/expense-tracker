const { error, Console } = require("console");
const path = require("path");
const rootDir = path.dirname(process.mainModule.filename);
const Expense = require("../models/expense");

exports.getExpense = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "index.html"));
};
exports.postExpense = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    const expenseamount = req.body.expenseamount;
    const category = req.body.category;
    const expensetype = req.body.expensetype;

    const data = await Expense.create({
      expenseamount: expenseamount,
      category: category,
      expensetype: expensetype,
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
    if (!req.params.id) {
      console.log("ID IS MISSING");
      return res.status(400).json({ err: "ID is missing" });
    }
    const uId = req.params.id;
    await Expense.destroy({ where: { id: uId } });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

