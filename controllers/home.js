const { error, Console } = require("console");
const path = require("path");
const rootDir = path.dirname(__dirname);
const Expense = require("../models/expense");
const User = require("../models/users");
const sequelize = require("../util/database");
const S3Service = require('../services/s3service');
const UserServices = require('../services/userservices');
const DownloadedFile = require('../models/download');
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
    
    const data = await Expense.findAll({ where: { expenseuserid: uId } });
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
exports.downloadexpense = async(req,res,next)=>{
    try{
        const expenses =await UserServices.getExpenses(req);
        //console.log("expenses",expenses)
        const stringifiedExpenses = JSON.stringify(expenses);
        //console.log(stringifiedExpenses);
        // based on userId
        const userId = req.user.userid;
        console.log(req.user,"user");
        const fileName =`Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Service.uploadToS3(stringifiedExpenses, fileName);
        //console.log(fileURL,"url",fileName,"name",userId);

          // record the downloaded file
          const downloadedFile = await DownloadedFile.create({
            fileName,
            downloadDate: new Date(),
            userId: req.user.userid
        });
        //console.log(fileURL,"url",fileName,"name",userId);

        res.status(200).json({fileURL, success:true })
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileURL:'',success:false,err:err})

    }
}
exports.getExpenses = async (req, res) => {
    try {
        const totalCount = await UserServices.countExpenses(req.user);
        const { page, rows } = req.query;
        const offset = (page - 1) * rows;
        const limit = parseInt(rows);
        const where = { offset, limit };
        console.log(req.user) // Add any additional filters or conditions for getting expenses
        const expenses = await UserServices.getExpenses(req.user.userid, where);
        //const expenses = await UserServices.getExpenses({ offset, limit });
        res.status(200).json({ expenses, totalCount });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!', error: error });
        console.log(error);
    }
};
