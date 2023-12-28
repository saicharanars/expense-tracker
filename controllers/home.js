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
    //t = await sequelize.transaction();
    const expenseamount = req.body.expenseamount;
    const category = req.body.category;
    const expensetype = req.body.expensetype;

    const userId = req.user.id;
   
    const expense = new Expense({
      expenseamount: expenseamount,
      category: category,
      expensetype: expensetype,
      userId: userId
      
    });
    if (!expense.expenseamount || !expense.category || !expense.expensetype || !expense.userId){
        res.status(400).json({ message:'expense data missing' });
        return;
    }
    //const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
    const data=await expense.save()
    const totalExpense =Number(req.user.totalExpenses) + Number(data.expenseamount);

    const totalexpense=await User.findByIdAndUpdate(req.user._id, { totalExpenses: totalExpense });
    console.log(data,totalexpense)
    res.status(200).json({ expenses: data,message:'expense added sucessfully' });
    return
  } catch (error) {
    
    console.log(error);
    res.status(500).json({
      error: error,
    });
    return
  }
};

// exports.getData = async (req, res, next) => {
//   try {
//     uId=req.params.id
    
//     const data = await Expense.find({_id:uId});
//     res.status(200).json({ expenses: data });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }
// };

exports.postDelete = async (req, res, next) => {
  let t;
  try {
    //t = await sequelize.transaction();
    const userId = req.user._id;
    console.log(userId);

    if (!req.params.id) {
      console.log("ID IS MISSING");
      return res.status(400).json({ err: "ID is missing" });
    }

    const uId = req.params.id;
    console.log(uId)
    const owner = await Expense.findOneAndDelete({
       _id: uId,userId:userId
    });
    const totalExpense =Number(req.user.totalExpenses) - Number(owner.expenseamount);
    console.log(owner,uId)
    const expensedeleteupdte = await User.findByIdAndUpdate(req.user.id, { totalExpenses: totalExpense });
     
    
    
    //await owner.destroy({transaction:t});
    //await t.commit();
      
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    //await t.rollback();
    res.status(500).json(err);
  }
};

exports.getUserLeaderBoard = async (req, res, next) => {
  try {
    const userLeaderBoardDetails = await User.find().sort('-totalExpenses');
    console.log(userLeaderBoardDetails);

    res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.downloadexpense = async(req,res,next)=>{
    try{
        console.log(req.user)
        const expenses = await Expense.find({ userId: req.user._id });
        console.log("expenses",expenses)
        const stringifiedExpenses = JSON.stringify(expenses);
        console.log(stringifiedExpenses);
        // based on userId
        const userId = req.user._id;
        console.log(req.user,"user");
        const fileName =`Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Service.uploadToS3(stringifiedExpenses, fileName);
        console.log(fileURL,"url",fileName,"name",userId);

          // record the downloaded file
          const downloadedFile = new DownloadedFile({
            fileName:fileName,
            downloadDate: new Date(),
            userId:userId
            
        });
        console.log(fileURL,"url", downloadedFile,fileName,"name",userId);

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
        console.log(totalCount)
        const { page, rows } = req.query;
        const offset = (page - 1) * rows;
        const limit = parseInt(rows);
        const where = { offset, limit };
        console.log(req.user,where)
         // Add any additional filters or conditions for getting expenses
        const expenses = await UserServices.getExpenses(req.user.id, where);
        //console.log(expenses);//const expenses = await UserSeruvices.getExpenses({ offset, limit });
        res.status(200).json({ expenses, totalCount });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!', error: error });
        console.log(error);
    }
};
