const { error, Console } = require("console");
const path = require("path");
const rootDir = path.dirname(process.mainModule.filename);
const Expense = require("../models/expense");
const User = require("../models/users");
const sequelize = require("../util/database");
exports.getExpense = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "index.html"));
};
exports.postExpense = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    t = await sequelize.transaction();
    const expenseamount = req.body.expenseamount;
    const category = req.body.category;
    const expensetype = req.body.expensetype;

    const userId = req.user.userid;
    console.log(userId);
    const data = await Expense.create({
      expenseamount: expenseamount,
      category: category,
      expensetype: expensetype,
      expenseuserId: userId,
      
    },{transaction: t});
    //const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
    console.log(req.user);
  
    const userupdte = await User.update(
      {
        totalExpenses: sequelize.literal(`totalExpenses + ${expenseamount}`),
        updatedAt: new Date()
      },
      {
        where: { id: userId },
        transaction: t
      },
     
    );
    await t.commit();
    res.status(200).json({ expenses: data });
  } catch (error) {
    if (t) await t.rollback();
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.getData = async (req, res, next) => {
  try {
    uId=req.params.id
    const data = await Expense.findAll({ where: { id: uId } });
    res.status(200).json({ expenses: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.postDelete = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const userId = req.user.userid;
    console.log(userId);

    if (!req.params.id) {
      console.log("ID IS MISSING");
      return res.status(400).json({ err: "ID is missing" });
    }

    const uId = req.params.id;
    const owner = await Expense.findOne({
      where: { id: uId, expenseuserId: userId },
    });
    
    console.log(owner,uId)
    const expensedeleteupdte = await User.update(
      {
        totalExpenses: sequelize.literal(`totalExpenses - ${owner.expenseamount}`),
        updatedAt: new Date()
      },
      {
        where: { id: uId },
        transaction: t
      },
     
    );
    
    await owner.destroy({transaction:t});
    await t.commit();
      
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json(err);
  }
};

exports.getUserLeaderBoard = async (req, res, next) => {
  try {
    const userLeaderBoardDetails = await User.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    console.log(userLeaderBoardDetails);

    res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
