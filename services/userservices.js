const ExpenseUsers = require("../models/expense");

const getExpenses = async(req,where)=>{
    console.log(req.user);
    expenses = await ExpenseUsers.findAll({
        where: {
          expenseuserid:req.user.userid
        },
      });
    console.log(expenses);
    return expenses;
    //return req.user.getExpenses(where);
}



module.exports={
 getExpenses
}