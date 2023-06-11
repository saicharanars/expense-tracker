const ExpenseUsers = require("../models/expense");

const getExpenses = async(req,where)=>{
    console.log(req);
    expenses = await ExpenseUsers.findAll({
        where: {
          expenseuserid:req
        },
      });
    console.log(expenses);
    return expenses;
    //return req.user.getExpenses(where);
}

const countExpenses =async(user,where)=>{
 const count = await ExpenseUsers.count(where);
 return count;
}



module.exports={
 getExpenses,
 countExpenses
}